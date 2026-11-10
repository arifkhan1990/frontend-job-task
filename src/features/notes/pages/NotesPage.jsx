import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatApiError } from '../../../api/client.js';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { ErrorState } from '../../../components/shared/ErrorState.jsx';
import { NoteSkeletonGrid } from '../../../components/shared/NoteSkeletonGrid.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx';
import { Pagination } from '../../../components/ui/Pagination.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { useDeleteNote, useNotes } from '../hooks.js';
import { NoteDialog } from '../components/NoteDialog.jsx';
import { formatDate } from '../../../utils/date.js';

export function NotesPage() {
  const { t, i18n } = useTranslation();
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
      toast.success(t('Note deleted'));
      setDeleting(null);

      if (notes.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    } catch (error) {
      toast.error(formatApiError(error, t));
    }
  }

  return (
    <>
      <Seo title={t('My notes')} path="/" noIndex />
      <PageHeader
        title={t('My notes')}
        description={
          user.role === 'admin'
            ? t('Admins: these are your own notes. Use All notes to read everyone else’s.')
            : t('Create, edit and delete your private notes.')
        }
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} aria-hidden="true" />
            {t('New note')}
          </Button>
        }
      />

      {notesQuery.isLoading ? (
        <div role="status" aria-label={t('Loading…')}>
          <NoteSkeletonGrid />
        </div>
      ) : null}

      {!notesQuery.isLoading && notesQuery.isError ? (
        <ErrorState
          message={formatApiError(notesQuery.error, t)}
          onRetry={notesQuery.refetch}
        />
      ) : null}

      {!notesQuery.isLoading && !notesQuery.isError && notes.length === 0 ? (
        <EmptyState
          title={t('No notes yet')}
          description={t('Create your first note to get started.')}
          action={
            <Button onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              {t('New note')}
            </Button>
          }
        />
      ) : null}

      {notes.length > 0 ? (
        <div className="ui-note-grid">
          {notes.map((note) => (
            <article className="ui-note-card" key={note._id}>
              <h2>{note.title}</h2>
              <p className="ui-note-card__content">{note.content}</p>
              <div className="ui-note-card__meta">
                <span>{formatDate(note.createdAt, i18n.language)}</span>
                <div className="ui-row">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(note)}>
                    {t('Edit')}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleting(note)}>
                    {t('Delete')}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="ui-row ui-pagination-row">
        <Pagination meta={meta} onPageChange={setPage} />
        {meta ? (
          <div className="ui-inline-field">
            <span className="ui-muted ui-small">{t('Rows per page')}</span>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
              ariaLabel={t('Rows per page')}
              options={[10, 20, 50].map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              className="ui-select-trigger--compact"
            />
          </div>
        ) : null}
      </div>

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
        title={t('Delete note?')}
        description={
          deleting
            ? t('This permanently deletes “{{title}}”.', { title: deleting.title })
            : undefined
        }
        busy={deleteNote.isPending}
      />
    </>
  );
}
