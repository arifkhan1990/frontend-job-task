import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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
        header: t('Owner'),
        meta: { label: t('Owner') },
        cell: ({ row }) => (
          <div>
            <div>{row.original.owner?.name || '—'}</div>
            <div className="ui-muted ui-small">{row.original.owner?.email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: t('Title'),
        meta: { label: t('Title') },
      },
      {
        accessorKey: 'content',
        header: t('Content'),
        meta: { label: t('Content') },
        cell: ({ getValue }) => (
          <span className="ui-truncate" title={getValue()}>
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('Created'),
        meta: { label: t('Created') },
        cell: ({ getValue }) => formatShortDate(getValue(), i18n.language),
      },
      {
        id: 'actions',
        header: t('Actions'),
        meta: { label: t('Actions') },
        enableSorting: false,
        cell: ({ row }) => (
          <LinkButton
            to={`/users/${row.original.owner?._id}/posts`}
            variant="ghost"
            size="sm"
          >
            {t('Posts')}
          </LinkButton>
        ),
      },
    ],
    [t, i18n.language],
  );

  const ownerOptions = [
    { value: 'all', label: t('All owners') },
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
      <Seo title={t('All notes')} path="/admin/notes" noIndex />
      <PageHeader
        title={t('All notes')}
        description={t('Read-only view across every user. Filter by owner when needed.')}
      />

      <div className="ui-filter-bar">
        <label className="ui-inline-field" htmlFor="all-notes-owner">
          <span className="ui-muted ui-small">{t('Owner')}</span>
          <Select
            id="all-notes-owner"
            value={owner}
            onValueChange={changeOwner}
            ariaLabel={t('Owner')}
            options={ownerOptions}
          />
        </label>
      </div>

      <DataTable
        columns={columns}
        data={notes}
        loading={notesQuery.isLoading}
        error={notesQuery.isError ? formatApiError(notesQuery.error, t) : ''}
        onRetry={notesQuery.refetch}
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        enableSelection={false}
        emptyTitle={t('No notes match this filter.')}
        searchPlaceholder={t('Search…')}
        renderMobileCard={(note) => (
          <div className="ui-stack">
            <strong>{note.title}</strong>
            <span className="ui-muted ui-small">
              {note.owner?.name} · {formatShortDate(note.createdAt, i18n.language)}
            </span>
            <span className="ui-truncate">{note.content}</span>
            <Link className="ui-small" to={`/users/${note.owner?._id}/posts`}>
              {t('Posts')}
            </Link>
          </div>
        )}
      />
    </>
  );
}
