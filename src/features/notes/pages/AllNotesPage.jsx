import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatApiError } from '../../../api/client.js';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { LinkButton } from '../../../components/ui/Button.jsx';
import { DataTable } from '../../../components/ui/DataTable.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { useUsers } from '../../users/hooks.js';
import { useNotes } from '../hooks.js';
import { formatShortDate } from '../../../utils/date.js';

export function AllNotesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [owner, setOwner] = useState('all');

  const usersQuery = useUsers({ page: 1, limit: 100 });
  const notesQuery = useNotes({
    page,
    limit,
    ownerId: owner === 'all' ? undefined : owner,
  });

  const users = usersQuery.data?.users || [];
  const notes = notesQuery.data?.notes || [];
  const meta = notesQuery.data?.meta;

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.owner?.name || '',
        id: 'owner',
        header: 'Owner',
        meta: { label: 'Owner' },
        cell: ({ row }) => (
          <div>
            <div>{row.original.owner?.name || '—'}</div>
            <div className="ui-muted ui-small">{row.original.owner?.email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        meta: { label: 'Title' },
      },
      {
        accessorKey: 'content',
        header: 'Content',
        meta: { label: 'Content' },
        cell: ({ getValue }) => (
          <span className="ui-truncate" title={getValue()}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        meta: { label: 'Created' },
        cell: ({ getValue }) => formatShortDate(getValue()),
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: { label: 'Actions' },
        enableSorting: false,
        cell: ({ row }) => (
          <LinkButton
            to={`/users/${row.original.owner?._id}/posts`}
            variant="ghost"
            size="sm"
          >
            {'Posts'}
          </LinkButton>
        ),
      },
    ],
    [],
  );

  const ownerOptions = [
    { value: 'all', label: 'All owners' },
    ...users.map((user) => ({
      value: user._id,
      label: `${user.name} (${user.email})`,
    })),
  ];

  function changeOwner(value) {
    setOwner(value);
    setPage(1);
  }

  return (
    <>
      <Seo title={'All notes'} path="/admin/notes" noIndex />
      <PageHeader
        title={'All notes'}
        description={'Read-only view across every user. Filter by owner when needed.'}
      />

      <div className="ui-filter-bar">
        <label className="ui-inline-field" htmlFor="all-notes-owner">
          <span className="ui-muted ui-small">{'Owner'}</span>
          <Select
            id="all-notes-owner"
            value={owner}
            onValueChange={changeOwner}
            ariaLabel={'Owner'}
            options={ownerOptions}
          />
        </label>
      </div>

      <DataTable
        columns={columns}
        data={notes}
        loading={notesQuery.isLoading}
        error={notesQuery.isError ? formatApiError(notesQuery.error) : ''}
        onRetry={notesQuery.refetch}
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        enableSelection={false}
        emptyTitle={'No notes match this filter.'}
        searchPlaceholder={'Search…'}
        renderMobileCard={(note) => (
          <div className="ui-stack">
            <strong>{note.title}</strong>
            <span className="ui-muted ui-small">
              {note.owner?.name} · {formatShortDate(note.createdAt)}
            </span>
            <span className="ui-truncate">{note.content}</span>
            <Link className="ui-small" to={`/users/${note.owner?._id}/posts`}>
              {'Posts'}
            </Link>
          </div>
        )}
      />
    </>
  );
}
