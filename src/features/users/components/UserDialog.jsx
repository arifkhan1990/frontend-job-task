import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatApiError } from '../../../api/client.js';
import { Button } from '../../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx';
import { Dialog } from '../../../components/ui/Dialog.jsx';
import { Field, Input } from '../../../components/ui/Field.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';
import { createUserSchema } from '../schemas.js';
import { useCreateUser, useUpdateUser } from '../hooks.js';

const EMPTY_VALUES = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  interests: '',
};

export function UserDialog({ open, onOpenChange, user, onSaved }) {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const isEdit = Boolean(user);
  const isSelf = isEdit && currentUser?._id === user._id;
  const schema = useMemo(() => createUserSchema({ isEdit }), [isEdit]);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const [confirmClose, setConfirmClose] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        user
          ? {
              name: user.name,
              email: user.email,
              password: '',
              role: user.role,
              interests: (user.interests || []).join(', '),
            }
          : EMPTY_VALUES,
      );
    }
  }, [open, user, reset]);

  useUnsavedChanges(open && isDirty);

  function requestClose(nextOpen) {
    if (!nextOpen && isDirty) {
      setConfirmClose(true);
      return;
    }

    onOpenChange(nextOpen);
  }

  async function submit(values) {
    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
      interests: values.interests
        .split(',')
        .map((interest) => interest.trim())
        .filter(Boolean),
    };

    if (values.password) {
      payload.password = values.password;
    }

    try {
      if (isEdit) {
        await updateUser.mutateAsync({ id: user._id, body: payload });
        toast.success('User updated');
      } else {
        await createUser.mutateAsync(payload);
        toast.success('User created');
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
        title={isEdit ? 'Edit user' : 'Add user'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => requestClose(false)} disabled={isSubmitting}>
              {'Cancel'}
            </Button>
            <Button type="submit" form="user-form" disabled={isSubmitting}>
              {isSubmitting ? 'Loading…' : 'Save user'}
            </Button>
          </>
        }
      >
        <form id="user-form" className="ui-stack" onSubmit={handleSubmit(submit)}>
          <div className="ui-form-grid">
            <Field label={'Name'} htmlFor="user-name" error={errors.name?.message}>
              <Input id="user-name" autoFocus maxLength={80} {...register('name')} />
            </Field>

            <Field label={'Email'} htmlFor="user-email" error={errors.email?.message}>
              <Input id="user-email" type="email" maxLength={254} {...register('email')} />
            </Field>

            <Field
              label={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
              htmlFor="user-password"
              error={errors.password?.message}
            >
              <Input
                id="user-password"
                type="password"
                autoComplete="new-password"
                maxLength={72}
                {...register('password')}
              />
            </Field>

            <Field label={'Role'} htmlFor="user-role" error={errors.role?.message}>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    id="user-role"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={'Select a role'}
                    ariaLabel={'Role'}
                    disabled={isSelf}
                    options={[
                      { value: 'user', label: 'User' },
                      { value: 'admin', label: 'Admin' },
                    ]}
                  />
                )}
              />
            </Field>
          </div>

          <Field
            label={'Interests'}
            htmlFor="user-interests"
            hint={'Comma-separated. Used by the admin interests view.'}
            error={errors.interests?.message}
          >
            <Input
              id="user-interests"
              placeholder={'e.g. chess'}
              {...register('interests')}
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
