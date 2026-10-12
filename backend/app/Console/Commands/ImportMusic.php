<?php

namespace App\Console\Commands;

use App\Services\MusicImporter;
use Illuminate\Console\Command;

/**
 * php artisan music:import
 * Imports every mp3 found in storage/app/public/music/<Artist Name>/ (see MusicImporter).
 * Safe to run again - existing files are updated, not duplicated.
 */
class ImportMusic extends Command
{
    protected $signature = 'music:import {--dir=music : Folder inside storage/app/public}';

    protected $description = 'Scan storage/app/public/music and import mp3 files (artists + tracks) into MySQL';

    public function handle(MusicImporter $importer): int
    {
        $result = $importer->scan($this->option('dir'));

        foreach ($result['titles'] as $title) {
            $this->line("  + {$title}");
        }
        $this->info("Done. {$result['imported']} track(s) imported/updated.");

        return self::SUCCESS;
    }
}
