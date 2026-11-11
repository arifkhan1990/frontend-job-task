import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatApiError } from '../../../api/client.js';
import { Button } from '../../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx';
import { Dialog } from '../../../components/ui/Dialog.jsx';
import { Field, Input, Textarea } from '../../../components/ui/Field.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';
import { createNoteSchema } from '../schemas.js';
import { useCreateNote, useUpdateNote } from '../hooks.js';

const EMPTY_VALUES = { title: '', content: '' };

export function NoteDialog({ open, onOpenChange, note, onSaved }) {
  const toast = useToast();
  const isEdit = Boolean(note);
  const schema = createNoteSchema();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const [confirmClose, setConfirmClose] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(note ? { title: note.title, content: note.content } : EMPTY_VALUES);
    }
  }, [open, note, reset]);

  useUnsavedChanges(open && isDirty);

  function requestClose(nextOpen) {
    if (!nextOpen && isDirty) {
      setConfirmClose(true);
      return;
    }

    onOpenChange(nextOpen);
  }

  async function submit(values) {
    try {
      if (isEdit) {
        await updateNote.mutateAsync({ id: note._id, body: values });
        toast.success('Note updated');
      } else {
        await createNote.mutateAsync(values);
        toast.success('Note created');
      }

      reset(EMPTY_VALUES);
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={requestClose}
        title={isEdit ? 'Edit note' : 'New note'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => requestClose(false)} disabled={isSubmitting}>
              {'Cancel'}
            </Button>
            <Button type="submit" form="note-form" disabled={isSubmitting}>
              {isSubmitting ? 'Loading…' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="note-form" className="ui-stack" onSubmit={handleSubmit(submit)}>
          <Field
            label={'Title'}
            htmlFor="note-title"
            error={errors.title?.message}
          >
            <Input
              id="note-title"
              autoFocus
              maxLength={200}
              {...register('title')}
            />
          </Field>

          <Field
            label={'Content'}
            htmlFor="note-content"
            error={errors.content?.message}
          >
            <Textarea
              id="note-content"
              maxLength={20000}
              {...register('content')}
            />
          </Field>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        onConfirm={() => {
          setConfirmClose(false);
          reset(EMPTY_VALUES);
          onOpenChange(false);
        }}
        title={'Discard unsaved changes?'}
        description={'Your edits will be lost.'}
        confirmLabel={'Discard'}
      />
    </>
  );
}
