import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

/** "Are you sure?" popup used before every delete. */
export function ConfirmDialog({ open, title, message, busy, onConfirm, onCancel }: { open: boolean; title: string; message: string; busy?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} className="max-w-md">
      <div className="p-6 pt-12 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400"><AlertTriangle /></span>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="!bg-red-500 !text-white" disabled={busy} onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete'}</Button>
        </div>
      </div>
    </Modal>
  );
}
