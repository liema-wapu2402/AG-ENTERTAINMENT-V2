import { useState } from 'react';
import { ExternalLink, FileSpreadsheet, Plus, Search } from 'lucide-react';
import { adminApi, errorMessage } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { AsyncView } from '@/components/ui/AsyncView';
import { Button, LinkButton } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { CsvImportModal } from '@/components/admin/CsvImportModal';
import { DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/admin/Pagination';
import { ResourceForm } from '@/components/admin/ResourceForm';
import type { ResourceConfig } from '@/admin/types';
import type { AdminRow } from '@/types';

/**
 * Generic admin screen: list + search + filter + paging + add / edit / delete + CSV import.
 * Everything comes from the ResourceConfig, so movies, songs, books... all share this page.
 */
export default function AdminResourcePage({ config }: { config: ResourceConfig }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const debounced = useDebounce(search.trim());
  const [editing, setEditing] = useState<AdminRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [toDelete, setToDelete] = useState<AdminRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const list = useApi(
    () => adminApi.list(config.resource, { page, per_page: 10, search: debounced || undefined, filter: config.filter && filter ? { [config.filter.name]: filter } : undefined }),
    [config.resource, page, debounced, filter],
  );

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (row: AdminRow) => { setEditing(row); setFormOpen(true); };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true); setError('');
    try {
      await adminApi.remove(config.resource, toDelete.id);
      setToDelete(null);
      // step back a page when the last row of a page was deleted
      if (list.data && list.data.data.length === 1 && page > 1) setPage(page - 1); else list.reload();
    } catch (err) { setError(errorMessage(err)); setToDelete(null); }
    finally { setDeleting(false); }
  };

  const label = (row: AdminRow | null) => String(row?.title ?? row?.name ?? 'this item');

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Manage</p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{config.title}</h1>
          <p className="text-sm text-muted">{list.data ? `${list.data.total} total` : 'Loading...'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton to={config.viewPath} variant="ghost" icon={<ExternalLink size={16} />}>View on site</LinkButton>
          {config.toolbar?.(list.reload)}
          {config.csv && <Button variant="outline" icon={<FileSpreadsheet size={16} />} onClick={() => setImportOpen(true)}>Import CSV</Button>}
          <Button icon={<Plus size={16} />} onClick={openAdd}>Add {config.singular}</Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 focus-within:border-accent">
          <Search size={16} className="text-muted" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={config.searchPlaceholder} className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </label>
        {config.filter && (
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent">
            <option value="">{config.filter.label}</option>
            {config.filter.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
      </div>

      {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      <AsyncView state={list} isEmpty={(d) => d.data.length === 0} emptyMessage={`No ${config.title.toLowerCase()} found.`} skeleton={<div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>}>
        {(d) => (
          <>
            <DataTable columns={config.columns} rows={d.data} onEdit={openEdit} onDelete={setToDelete} />
            <Pagination page={d.current_page} last={d.last_page} onChange={setPage} />
          </>
        )}
      </AsyncView>

      <ResourceForm config={config} row={editing} open={formOpen} onClose={() => setFormOpen(false)} onSaved={list.reload} />
      <CsvImportModal config={config} open={importOpen} onClose={() => setImportOpen(false)} onDone={list.reload} />
      <ConfirmDialog open={Boolean(toDelete)} busy={deleting} title={`Delete ${config.singular}?`} message={`"${label(toDelete)}" will be removed permanently, including its uploaded files.`} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}
