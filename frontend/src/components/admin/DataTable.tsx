import { Pencil, Trash2 } from 'lucide-react';
import type { Column } from '@/admin/types';
import type { AdminRow } from '@/types';

interface Props { columns: Column[]; rows: AdminRow[]; onEdit: (row: AdminRow) => void; onDelete: (row: AdminRow) => void }

/** Row action buttons (shared by the table and the mobile cards). */
function Actions({ row, onEdit, onDelete }: { row: AdminRow } & Pick<Props, 'onEdit' | 'onDelete'>) {
  return (
    <div className="flex justify-end gap-1">
      <button onClick={() => onEdit(row)} aria-label="Edit" className="rounded-lg p-2 text-muted transition hover:bg-elevated hover:text-accent"><Pencil size={16} /></button>
      <button onClick={() => onDelete(row)} aria-label="Delete" className="rounded-lg p-2 text-muted transition hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>
    </div>
  );
}

/** Table on desktop, stacked cards on phones. Both are generated from the same column config. */
export function DataTable({ columns, rows, onEdit, onDelete }: Props) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-line bg-surface md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-elevated/60 text-xs uppercase tracking-wider text-muted">
            <tr>{columns.map((c) => <th key={c.label} className={`px-4 py-3 font-semibold ${c.className ?? ''}`}>{c.label}</th>)}<th className="w-24 px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-elevated/50">
                {columns.map((c) => <td key={c.label} className={`px-4 py-3 ${c.className ?? ''}`}>{c.render(row)}</td>)}
                <td className="px-2 py-2"><Actions row={row} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 font-semibold">{columns[0].render(row)}</div>
              <Actions row={row} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {columns.slice(1).map((c) => (
                <div key={c.label} className="min-w-0"><dt className="text-muted">{c.label}</dt><dd className="truncate">{c.render(row) ?? '—'}</dd></div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
