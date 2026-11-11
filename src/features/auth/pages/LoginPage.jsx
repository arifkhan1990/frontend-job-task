import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatApiError } from '../../../api/client.js';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Field, Input } from '../../../components/ui/Field.jsx';
import { LoadingState } from '../../../components/shared/LoadingState.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { useAuth } from '../AuthProvider.jsx';
import { createLoginSchema } from '../schemas.js';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState('');
  const schema = createLoginSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  if (loading) {
    return <LoadingState />;
  }

  const from = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function submit(values) {
    setSubmitError('');

    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(formatApiError(error));
    }
  }

  return (
    <>
      <Seo title={'Log in'} path="/login" noIndex />
      <div className="ui-auth__content">
        <div className="ui-auth__heading">
          <p className="ui-auth__eyebrow">{'Secure notes, clear mind.'}</p>
          <h1>{'Welcome back'}</h1>
          <p className="ui-muted">{'Log in to manage your notes.'}</p>
        </div>

        <Alert>{submitError}</Alert>

        <form className="ui-stack" onSubmit={handleSubmit(submit)} noValidate>
          <Field label={'Email'} htmlFor="login-email" error={errors.email?.message}>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              autoFocus
              {...register('email')}
            />
          </Field>

          <Field
            label={'Password'}
            htmlFor="login-password"
            error={errors.password?.message}
          >
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <p className="ui-muted ui-small">
          {'No account?'} <Link to="/register">{'Register here'}</Link>.
        </p>
      </div>
    </>
  );
}
