import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState('');
  const schema = useMemo(() => createLoginSchema(t), [t]);

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
      setSubmitError(formatApiError(error, t));
    }
  }

  return (
    <>
      <Seo title={t('Log in')} path="/login" noIndex />
      <div className="ui-auth">
        <div className="ui-auth__card">
          <div className="ui-auth__heading">
            <h1>{t('Welcome back')}</h1>
            <p className="ui-muted">{t('Log in to manage your notes.')}</p>
          </div>

          <Alert>{submitError}</Alert>

          <form className="ui-stack" onSubmit={handleSubmit(submit)} noValidate>
            <Field label={t('Email')} htmlFor="login-email" error={errors.email?.message}>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                autoFocus
                {...register('email')}
              />
            </Field>

            <Field
              label={t('Password')}
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
              {isSubmitting ? t('Logging in…') : t('Log in')}
            </Button>
          </form>

          <p className="ui-muted ui-small">
            {t('No account?')} <Link to="/register">{t('Register here')}</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
