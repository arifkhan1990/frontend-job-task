import { NotebookPen, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatApiError } from '../../../api/client.js';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { ErrorState } from '../../../components/shared/ErrorState.jsx';
import { NoteSkeletonGrid } from '../../../components/shared/NoteSkeletonGrid.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx';
import { Pagination } from '../../../components/ui/Pagination.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { NoteCard } from '../components/NoteCard.jsx';
import { NoteDialog } from '../components/NoteDialog.jsx';
import { useDeleteNote, useNotes } from '../hooks.js';

export function NotesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const ownerId = user.role === 'admin' ? user._id : undefined;
  const notesQuery = useNotes({ page, limit, ownerId });
  const deleteNote = useDeleteNote();

  const notes = notesQuery.data?.notes || [];
  const meta = notesQuery.data?.meta;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(note) {
    setEditing(note);
    setDialogOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) {
      return;
    }

    try {
      await deleteNote.mutateAsync(deleting._id);
      toast.success('Note deleted');
      setDeleting(null);

      if (notes.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <>
      <Seo title={'My notes'} path="/" noIndex />
      <PageHeader
        title={'My notes'}
        description={
          user.role === 'admin'
            ? 'Your private notes. Use All notes to read everyone else’s.'
            : 'A private space for ideas, checklists and reminders.'
        }
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} aria-hidden="true" />
            {'New note'}
          </Button>
        }
      >
        {meta ? (
          <div className="ui-page-header__meta">
            <Badge>{`${meta.total} ${meta.total === 1 ? 'note' : 'notes'}`}</Badge>
          </div>
        ) : null}
      </PageHeader>

      {notesQuery.isLoading ? (
        <div role="status" aria-label={'Loading…'}>
          <NoteSkeletonGrid />
        </div>
      ) : null}

      {!notesQuery.isLoading && notesQuery.isError ? (
        <ErrorState
          message={formatApiError(notesQuery.error)}
          onRetry={notesQuery.refetch}
        />
      ) : null}

      {!notesQuery.isLoading && !notesQuery.isError && notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={'Your workspace is empty'}
          description={
            'Create your first note — ideas, checklists and reminders stay private to you.'
          }
          action={
            <Button onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              {'Create your first note'}
            </Button>
          }
        />
      ) : null}

      {notes.length > 0 ? (
        <div className="ui-note-grid">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      ) : null}

      {meta && meta.pages > 1 ? (
        <div className="ui-row ui-pagination-row">
          <Pagination meta={meta} onPageChange={setPage} />
          <div className="ui-inline-field">
            <span className="ui-muted ui-small">{'Rows per page'}</span>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
              ariaLabel={'Rows per page'}
              options={[10, 20, 50].map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              className="ui-select-trigger--compact"
            />
          </div>
        </div>
      ) : null}

      <NoteDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditing(null);
          }
        }}
        note={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        onConfirm={confirmDelete}
        title={'Delete note?'}
        description={
          deleting
            ? `This permanently deletes “${deleting.title}”.`
            : undefined
        }
        busy={deleteNote.isPending}
      />
    </>
  );
}
