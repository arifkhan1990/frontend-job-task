import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { formatApiError } from '../../../api/client.js';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Field, Input } from '../../../components/ui/Field.jsx';
import { LoadingState } from '../../../components/shared/LoadingState.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { useAuth } from '../AuthProvider.jsx';
import { createRegisterSchema } from '../schemas.js';

export function RegisterPage() {
  const { user, loading, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const schema = createRegisterSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', interests: '' },
  });

  if (loading) {
    return <LoadingState />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function submit(values) {
    setSubmitError('');

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        interests: values.interests
          .split(',')
          .map((interest) => interest.trim())
          .filter(Boolean),
      });
      navigate('/', { replace: true });
    } catch (error) {
      setSubmitError(formatApiError(error));
    }
  }

  return (
    <>
      <Seo title={'Create account'} path="/register" noIndex />
      <div className="ui-auth__content">
        <div className="ui-auth__heading">
          <p className="ui-auth__eyebrow">{'Secure notes, clear mind.'}</p>
          <h1>{'Create account'}</h1>
          <p className="ui-muted">{'New accounts start with the user role.'}</p>
        </div>

        <Alert>{submitError}</Alert>

        <form className="ui-stack" onSubmit={handleSubmit(submit)} noValidate>
          <Field label={'Name'} htmlFor="register-name" error={errors.name?.message}>
            <Input
              id="register-name"
              autoComplete="name"
              autoFocus
              maxLength={80}
              {...register('name')}
            />
          </Field>

          <Field label={'Email'} htmlFor="register-email" error={errors.email?.message}>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
          </Field>

          <Field
            label={'Password'}
            htmlFor="register-password"
            error={errors.password?.message}
          >
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              maxLength={72}
              {...register('password')}
            />
          </Field>

          <Field
            label={'Interests'}
            htmlFor="register-interests"
            hint={'Comma-separated. Used by the admin interests view.'}
            error={errors.interests?.message}
          >
            <Input
              id="register-interests"
              placeholder={'e.g. chess'}
              {...register('interests')}
            />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="ui-muted ui-small">
          {'Already registered?'} <Link to="/login">{'Log in here'}</Link>.
        </p>
      </div>
    </>
  );
}
