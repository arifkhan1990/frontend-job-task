import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatApiError } from '../../../api/client.js';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button, LinkButton } from '../../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx';
import { DataTable } from '../../../components/ui/DataTable.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { UserDialog } from '../components/UserDialog.jsx';
import {
  useBulkDeleteUsers,
  useDeleteUser,
  useUsers,
} from '../hooks.js';
import { formatShortDate } from '../../../utils/date.js';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);

  const usersQuery = useUsers({ page, limit });
  const deleteUser = useDeleteUser();
  const bulkDeleteUsers = useBulkDeleteUsers();

  const users = usersQuery.data?.users || [];
  const meta = usersQuery.data?.meta;

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        meta: { label: 'Name' },
        cell: ({ row }) => (
          <span>
            {row.original.name}
            {row.original._id === currentUser._id ? (
              <span className="ui-muted"> ({'Account'})</span>
            ) : null}
          </span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        meta: { label: 'Email' },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        meta: { label: 'Role' },
        cell: ({ getValue }) => (
          <Badge tone={getValue() === 'admin' ? 'admin' : 'neutral'}>
            {getValue() === 'admin' ? 'Admin' : 'User'}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => (row.interests || []).join(', '),
        id: 'interests',
        header: 'Interests',
        meta: { label: 'Interests' },
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
          <div className="ui-row">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(row.original);
                setDialogOpen(true);
              }}
            >
              {'Edit'}
            </Button>
            <LinkButton
              to={`/users/${row.original._id}/posts`}
              variant="ghost"
              size="sm"
            >
              {'Posts'}
            </LinkButton>
          </div>
        ),
      },
    ],
    [currentUser._id],
  );

  async function confirmDelete() {
    if (!deleting) {
      return;
    }

    try {
      await deleteUser.mutateAsync(deleting._id);
      toast.success('User deleted');
      setDeleting(null);

      if (users.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  async function confirmBulkDelete() {
    try {
      await bulkDeleteUsers.mutateAsync(bulkSelection.map((user) => user._id));
      toast.success('Users deleted');
      setBulkOpen(false);

      if (users.length === bulkSelection.length && page > 1) {
        setPage((current) => current - 1);
      }

      setBulkSelection([]);
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <>
      <Seo title={'Users'} path="/admin/users" noIndex />
      <PageHeader
        title={'Users'}
        description={'Create accounts, update roles and remove users.'}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={16} aria-hidden="true" />
            {'Add user'}
          </Button>
        }
      />

      {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 ? (
        <EmptyState title={'No data'} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          loading={usersQuery.isLoading}
          error={usersQuery.isError ? formatApiError(usersQuery.error) : ''}
          onRetry={usersQuery.refetch}
          meta={meta}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
          canSelectRow={(row) => row._id !== currentUser._id}
          bulkActions={({ selectedRows }) => (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setBulkSelection(selectedRows);
                setBulkOpen(true);
              }}
            >
              {'Delete selected'}
            </Button>
          )}
          emptyTitle={'No data'}
          searchPlaceholder={'Search…'}
          renderMobileCard={(user) => (
            <div className="ui-stack">
              <strong>{user.name}</strong>
              <span className="ui-muted ui-small">{user.email}</span>
              <span>
                <Badge tone={user.role === 'admin' ? 'admin' : 'neutral'}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Badge>
              </span>
              <span className="ui-muted ui-small">
                {(user.interests || []).join(', ') || '—'}
              </span>
              <div className="ui-row">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditing(user);
                    setDialogOpen(true);
                  }}
                >
                  {'Edit'}
                </Button>
                <LinkButton
                  to={`/users/${user._id}/posts`}
                  variant="ghost"
                  size="sm"
                >
                  {'Posts'}
                </LinkButton>
              </div>
            </div>
          )}
        />
      )}

      <UserDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditing(null);
          }
        }}
        user={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        onConfirm={confirmDelete}
        title={'Delete user?'}
        description={
          deleting
            ? `This permanently deletes “${deleting.name}” and all of their content.`
            : undefined
        }
        busy={deleteUser.isPending}
      />

      <ConfirmDialog
        open={bulkOpen}
        onOpenChange={(open) => {
          setBulkOpen(open);
          if (!open) {
            setBulkSelection([]);
          }
        }}
        onConfirm={confirmBulkDelete}
        title={`Delete ${bulkSelection.length} users?`}
        description="This permanently deletes the selected users and all of their notes and posts."
        busy={bulkDeleteUsers.isPending}
      />
    </>
  );
}
