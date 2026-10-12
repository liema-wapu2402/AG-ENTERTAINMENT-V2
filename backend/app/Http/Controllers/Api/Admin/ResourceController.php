<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * Generic admin CRUD + CSV import.
 * Each module (movies, artists, tracks, books, genres) only describes itself:
 * model, validation rules, file fields and (optionally) CSV import columns.
 * Everything else - paging, search, uploads, deleting files - lives here once.
 */
abstract class ResourceController extends Controller
{
    /** Eloquent model class. */
    abstract protected function model(): string;

    /** Validation rules. $record is null when creating. */
    abstract protected function rules(?Model $record): array;

    /** Relations loaded in the list. */
    protected function with(): array
    {
        return [];
    }

    /** Relation counters loaded in the list (e.g. 'tracks'). */
    protected function counts(): array
    {
        return [];
    }

    /** Columns used by the search box. */
    protected function searchColumns(): array
    {
        return ['title'];
    }

    /** Hidden model attributes the admin form needs (raw paths, foreign keys). */
    protected function visible(): array
    {
        return [];
    }

    /** Column the slug is made from (null = model has no slug). */
    protected function slugFrom(): ?string
    {
        return null;
    }

    /**
     * File fields: request field => [column, folder inside storage/app/public].
     * e.g. ['poster_file' => ['poster', 'posters']]
     */
    protected function files(): array
    {
        return [];
    }

    /** Last chance to change the data before saving (e.g. read mp3 duration). */
    protected function prepare(array $data, ?Model $record): array
    {
        return $data;
    }

    // ------------------------------------------------------------------ CRUD

    /** GET /api/admin/{resource}?search=&page=&per_page= */
    public function index(Request $request): JsonResponse
    {
        $class = $this->model();
        $query = $class::query()->with($this->with())->withCount($this->counts());

        if ($term = trim((string) $request->query('search', ''))) {
            $like = '%'.addcslashes($term, '%_\\').'%';
            $query->where(function ($q) use ($like) {
                foreach ($this->searchColumns() as $column) {
                    $q->orWhere($column, 'like', $like);
                }
            });
        }
        foreach ($request->query('filter', []) as $column => $value) {
            // simple exact filters, e.g. ?filter[category]=series (only known columns)
            if ($value !== '' && in_array($column, (new $class)->getFillable(), true)) {
                $query->where($column, $value);
            }
        }

        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        return response()->json(
            $query->latest('id')->paginate($perPage)->through(fn (Model $m) => $m->makeVisible($this->visible()))
        );
    }

    /** POST /api/admin/{resource} */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules(null));
        $data = $this->saveFiles($request, $data, null);
        $data = $this->prepare($data, null);

        if ($from = $this->slugFrom()) {
            $data['slug'] = $this->uniqueSlug($data[$from]);
        }

        $class = $this->model();
        $record = $class::create($data);

        return response()->json($this->fresh($record), 201);
    }

    /** PATCH /api/admin/{resource}/{id}  (frontend sends POST + _method=PATCH for uploads) */
    public function update(Request $request, string $id): JsonResponse
    {
        $class = $this->model();
        $record = $class::findOrFail($id);

        $data = $request->validate($this->rules($record));
        $data = $this->saveFiles($request, $data, $record);
        $data = $this->prepare($data, $record);

        $record->update($data);

        return response()->json($this->fresh($record));
    }

    /** DELETE /api/admin/{resource}/{id} -> also removes uploaded files. */
    public function destroy(string $id): JsonResponse
    {
        $class = $this->model();
        $record = $class::findOrFail($id);

        foreach ($this->files() as [$column]) {
            $this->deleteStored($record->{$column});
        }
        $record->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // ------------------------------------------------------------------ CSV import

    /** CSV column names accepted by import() (empty = import not supported). */
    protected function importColumns(): array
    {
        return [];
    }

    /**
     * Turns one CSV row into [lookup, attributes] or throws \InvalidArgumentException.
     * lookup = columns that identify an existing record (so re-importing updates instead of duplicating).
     */
    protected function importRow(array $row): array
    {
        throw new \InvalidArgumentException('Import is not supported here.');
    }

    /** POST /api/admin/{resource}/import   (multipart: file=csv) */
    public function import(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt|max:5120']);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($handle);
        if (! $header) {
            return response()->json(['message' => 'The CSV file is empty.'], 422);
        }
        // strip UTF-8 BOM + normalise header names
        $header = array_map(fn ($h) => strtolower(trim(preg_replace('/^\xEF\xBB\xBF/', '', (string) $h))), $header);

        $imported = 0;
        $errors = [];
        $line = 1;
        $class = $this->model();

        while (($cells = fgetcsv($handle)) !== false && $line < 2001) {
            $line++;
            if (count(array_filter($cells, fn ($c) => trim((string) $c) !== '')) === 0) {
                continue; // blank line
            }
            $row = array_combine($header, array_pad(array_slice($cells, 0, count($header)), count($header), null));
            $row = array_map(fn ($v) => ($v === null || trim($v) === '') ? null : trim($v), $row);

            try {
                [$lookup, $attributes] = $this->importRow($row);
                $class::updateOrCreate($lookup, $attributes);
                $imported++;
            } catch (\Throwable $e) {
                $errors[] = "Line {$line}: ".$e->getMessage();
            }
        }
        fclose($handle);

        return response()->json(['imported' => $imported, 'errors' => array_slice($errors, 0, 15), 'error_count' => count($errors)]);
    }

    /** Validates one CSV row with a subset of rules; returns the validated values. */
    protected function validateRow(array $row, array $rules): array
    {
        $validator = Validator::make($row, $rules);
        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->errors()->first());
        }

        return $validator->validated();
    }

    // ------------------------------------------------------------------ helpers

    /** Stores uploaded files, deletes the replaced ones and maps request fields to DB columns. */
    private function saveFiles(Request $request, array $data, ?Model $record): array
    {
        foreach ($this->files() as $field => [$column, $folder]) {
            unset($data[$field]);
            if ($request->hasFile($field)) {
                if ($record) {
                    $this->deleteStored($record->{$column});
                }
                $data[$column] = $request->file($field)->store($folder, 'public');
            }
        }

        return $data;
    }

    /** Deletes a stored upload (values starting with "/" or "http" are not uploads). */
    protected function deleteStored(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/') && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }

    protected function uniqueSlug(string $text, ?int $ignoreId = null): string
    {
        $class = $this->model();
        $base = Str::slug($text) ?: 'item';
        $slug = $base;
        $i = 2;
        while ($class::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    private function fresh(Model $record): Model
    {
        return $record->fresh($this->with())->makeVisible($this->visible());
    }
}
