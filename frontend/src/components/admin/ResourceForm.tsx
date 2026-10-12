import { useEffect, useState, type FormEvent } from 'react';
import { adminApi, errorMessage } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Field, Option, ResourceConfig } from '@/admin/types';
import type { AdminRow } from '@/types';

const inputClass = 'w-full rounded-xl border border-line bg-elevated/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30';

/** Select options: fixed list, or loaded from another admin resource (e.g. artists for a song). */
function useOptions(field: Field): Option[] {
  const [loaded, setLoaded] = useState<Option[]>([]);
  useEffect(() => {
    if (!field.optionsFrom) return;
    const { resource, label } = field.optionsFrom;
    adminApi.list(resource, { per_page: 100 }).then((r) => setLoaded(r.data.map((row) => ({ value: row.id, label: String(row[label]) })))).catch(() => setLoaded([]));
  }, [field.optionsFrom]);
  return field.options ?? loaded;
}

/** One input, rendered from its field config. */
function FieldInput({ field, row, creating, onFile }: { field: Field; row: AdminRow | null; creating: boolean; onFile: (name: string, file: File | null) => void }) {
  const options = useOptions(field);
  const required = field.required || (creating && field.requiredOnCreate);
  const value = row?.[field.name];

  return (
    <label className={`block ${field.full || field.type === 'textarea' || field.type === 'file' ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">{field.label}{required && <span className="text-accent"> *</span>}</span>

      {field.type === 'textarea' && <textarea name={field.name} rows={4} defaultValue={(value as string) ?? ''} className={inputClass} />}

      {field.type === 'select' && (
        <select name={field.name} required={required} defaultValue={value == null ? '' : String(value)} className={inputClass}>
          <option value="" disabled={required}>{required ? 'Select...' : '— none —'}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}

      {field.type === 'file' && (
        <div className="flex items-center gap-3">
          {Boolean(field.preview && row?.[field.preview]) && !String(field.accept).includes('audio') && <img src={String(row?.[field.preview!])} alt="" className="h-14 w-14 rounded-lg object-cover" />}
          <input type="file" accept={field.accept} required={Boolean(required)} onChange={(e) => onFile(field.name, e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-semibold file:text-accent-fg hover:file:brightness-110" />
        </div>
      )}

      {(field.type === 'text' || field.type === 'url' || field.type === 'number') && (
        <input name={field.name} type={field.type} step={field.step} required={Boolean(required)} defaultValue={value == null ? '' : String(value)} className={inputClass} />
      )}

      {field.help && <span className="mt-1 block text-xs text-muted">{field.help}</span>}
    </label>
  );
}

interface Props { config: ResourceConfig; row: AdminRow | null; open: boolean; onClose: () => void; onSaved: () => void }

/** Add / edit popup built from config.fields. Sends multipart FormData so files upload too. */
export function ResourceForm({ config, row, open, onClose, onSaved }: Props) {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const creating = row === null;

  useEffect(() => { if (open) { setFiles({}); setError(''); } }, [open, row]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setError('');
    const form = new FormData();
    const values = new FormData(e.currentTarget);
    config.fields.forEach((f) => {
      if (f.type === 'file') { const file = files[f.name]; if (file) form.append(f.name, file); }
      else form.append(f.name, String(values.get(f.name) ?? ''));
    });
    try {
      await adminApi.save(config.resource, form, row?.id);
      onSaved(); onClose();
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={creating ? `Add ${config.singular}` : `Edit ${config.singular}`} className="max-w-2xl">
      <form onSubmit={submit} className="p-5 pt-14 sm:p-8 sm:pt-10">
        <h2 className="mb-6 text-xl font-bold">{creating ? `Add ${config.singular}` : `Edit ${config.singular}`}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((f) => <FieldInput key={`${row?.id ?? 'new'}-${f.name}`} field={f} row={row} creating={creating} onFile={(n, file) => setFiles((s) => ({ ...s, [n]: file }))} />)}
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving...' : creating ? `Add ${config.singular}` : 'Save changes'}</Button>
        </div>
      </form>
    </Modal>
  );
}
