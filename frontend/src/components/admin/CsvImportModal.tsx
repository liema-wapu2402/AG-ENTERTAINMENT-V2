import { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { adminApi, errorMessage } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { ResourceConfig } from '@/admin/types';

/** CSV import: shows the expected columns, offers a template download, then uploads the file. */
export function CsvImportModal({ config, open, onClose, onDone }: { config: ResourceConfig; open: boolean; onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ imported: number; errors: string[]; error_count: number } | null>(null);
  if (!config.csv) return null;

  const downloadTemplate = () => {
    const blob = new Blob([`${config.csv!.headers.join(',')}\n${config.csv!.sample}\n`], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${config.resource}-template.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true); setError(''); setResult(null);
    try { const r = await adminApi.importCsv(config.resource, file); setResult(r); if (r.imported) onDone(); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  const close = () => { setFile(null); setResult(null); setError(''); onClose(); };

  return (
    <Modal open={open} onClose={close} title="Import CSV" className="max-w-xl">
      <div className="p-5 pt-14 sm:p-8 sm:pt-10">
        <h2 className="flex items-center gap-2 text-xl font-bold"><FileSpreadsheet className="text-accent" /> Import {config.title.toLowerCase()} from CSV</h2>
        <p className="mt-2 text-sm text-muted">The first row must contain these column names. Existing items with the same title are updated, not duplicated.</p>
        <p className="mt-3 break-words rounded-xl bg-elevated p-3 font-mono text-xs">{config.csv.headers.join(', ')}</p>
        <button onClick={downloadTemplate} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"><Download size={15} /> Download template</button>

        <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-5 w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-semibold file:text-accent-fg" />

        {error && <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
        {result && (
          <div className="mt-4 rounded-lg bg-accent/10 p-3 text-sm">
            <p className="font-semibold text-accent">{result.imported} row(s) imported.</p>
            {result.error_count > 0 && (
              <div className="mt-2 text-red-400"><p>{result.error_count} row(s) skipped:</p><ul className="mt-1 list-disc pl-5 text-xs">{result.errors.map((e) => <li key={e}>{e}</li>)}</ul></div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={close}>Close</Button>
          <Button disabled={!file || busy} onClick={run}>{busy ? 'Importing...' : 'Import'}</Button>
        </div>
      </div>
    </Modal>
  );
}
