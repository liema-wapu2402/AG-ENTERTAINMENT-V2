import { useEffect, useState } from 'react';
import { FolderSync, Upload } from 'lucide-react';
import { adminApi, errorMessage } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Option } from '@/admin/types';

/** Music-only toolbar: upload many mp3 files for an artist, or import the mp3 folder on the server. */
export function TrackTools({ reload }: { reload: () => void }) {
  const [open, setOpen] = useState(false);
  const [artists, setArtists] = useState<Option[]>([]);
  const [artistId, setArtistId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState<'upload' | 'scan' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    adminApi.list('artists', { per_page: 100 }).then((r) => setArtists(r.data.map((a) => ({ value: a.id, label: String(a.name) })))).catch(() => undefined);
  }, [open]);

  const upload = async () => {
    setBusy('upload'); setError(''); setMessage('');
    try { const r = await adminApi.uploadTracks(artistId, files); setMessage(`${r.imported} song(s) uploaded.`); setFiles([]); reload(); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(null); }
  };

  const scan = async () => {
    setBusy('scan'); setError('');
    try { const r = await adminApi.scanMusic(); alert(`${r.imported} song(s) imported from storage/app/public/music.`); reload(); }
    catch (err) { alert(errorMessage(err)); }
    finally { setBusy(null); }
  };

  return (
    <>
      <Button variant="outline" icon={<Upload size={16} />} onClick={() => setOpen(true)}>Upload mp3</Button>
      <Button variant="outline" icon={<FolderSync size={16} />} onClick={scan} disabled={busy === 'scan'}>{busy === 'scan' ? 'Scanning...' : 'Import music folder'}</Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Upload mp3" className="max-w-lg">
        <div className="p-5 pt-14 sm:p-8 sm:pt-10">
          <h2 className="text-xl font-bold">Upload mp3 files</h2>
          <p className="mt-2 text-sm text-muted">Choose the artist, then select one or many mp3 files (max 50 MB each). Titles come from the file names.</p>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)} className="mt-4 w-full rounded-xl border border-line bg-elevated/60 px-4 py-2.5 text-sm outline-none focus:border-accent">
            <option value="">Select artist...</option>
            {artists.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
          <input type="file" accept=".mp3,audio/mpeg" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-4 w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-semibold file:text-accent-fg" />
          {files.length > 0 && <p className="mt-2 text-xs text-muted">{files.length} file(s) selected</p>}
          {error && <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
          {message && <p className="mt-4 rounded-lg bg-accent/10 p-3 text-sm text-accent">{message}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button disabled={!artistId || files.length === 0 || busy === 'upload'} onClick={upload}>{busy === 'upload' ? 'Uploading...' : 'Upload'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
