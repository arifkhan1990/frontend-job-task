import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { formatApiError } from '../../../api/client.js';
import { Button } from '../../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx';
import { Dialog } from '../../../components/ui/Dialog.jsx';
import { Field, Input, Textarea } from '../../../components/ui/Field.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';
import { useCreatePost } from '../hooks.js';
import { createPostSchema } from '../schemas.js';

const EMPTY_VALUES = { title: '', content: '' };

export function PostDialog({ open, onOpenChange, userId }) {
  const toast = useToast();
  const schema = createPostSchema();
  const createPost = useCreatePost(userId);
  const [confirmClose, setConfirmClose] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  const titleValue = useWatch({ control, name: 'title' }) || '';
  const contentValue = useWatch({ control, name: 'content' }) || '';

  useEffect(() => {
    if (open) {
      reset(EMPTY_VALUES);
    }
  }, [open, reset]);

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
      await createPost.mutateAsync(values);
      toast.success('Post created');
      reset(EMPTY_VALUES);
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
        title={'New post'}
        description={'Publish to your public profile. Anyone can read it.'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => requestClose(false)} disabled={isSubmitting}>
              {'Cancel'}
            </Button>
            <Button type="submit" form="post-form" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing…' : 'Publish post'}
            </Button>
          </>
        }
      >
        <form id="post-form" className="ui-stack" onSubmit={handleSubmit(submit)}>
          <Field
            label={'Title'}
            htmlFor="post-title"
            error={errors.title?.message}
            counter={`${titleValue.length}/200`}
          >
            <Input
              id="post-title"
              autoFocus
              maxLength={200}
              placeholder="e.g. What I learned this week"
              {...register('title')}
            />
          </Field>
          <Field
            label={'Content'}
            htmlFor="post-content"
            error={errors.content?.message}
            hint="Visible to everyone on your public profile."
            counter={`${contentValue.length}/20000`}
          >
            <Textarea
              id="post-content"
              maxLength={20000}
              rows={10}
              placeholder="Write your post…"
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
