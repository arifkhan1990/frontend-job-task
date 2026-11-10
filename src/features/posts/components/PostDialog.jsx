import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const toast = useToast();
  const schema = useMemo(() => createPostSchema(t), [t]);
  const createPost = useCreatePost(userId);
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
      toast.success(t('Post created'));
      reset(EMPTY_VALUES);
      onOpenChange(false);
    } catch (error) {
      toast.error(formatApiError(error, t));
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={requestClose}
        title={t('New post')}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => requestClose(false)} disabled={isSubmitting}>
              {t('Cancel')}
            </Button>
            <Button type="submit" form="post-form" disabled={isSubmitting}>
              {isSubmitting ? t('Publishing…') : t('Publish post')}
            </Button>
          </>
        }
      >
        <form id="post-form" className="ui-stack" onSubmit={handleSubmit(submit)}>
          <Field label={t('Title')} htmlFor="post-title" error={errors.title?.message}>
            <Input id="post-title" autoFocus maxLength={200} {...register('title')} />
          </Field>
          <Field label={t('Content')} htmlFor="post-content" error={errors.content?.message}>
            <Textarea id="post-content" maxLength={20000} {...register('content')} />
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
        title={t('Discard unsaved changes?')}
        description={t('Your edits will be lost.')}
        confirmLabel={t('Discard')}
      />
    </>
  );
}
