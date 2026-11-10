import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { user, loading, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const schema = useMemo(() => createRegisterSchema(t), [t]);

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
      setSubmitError(formatApiError(error, t));
    }
  }

  return (
    <>
      <Seo title={t('Create account')} path="/register" noIndex />
      <div className="ui-auth">
        <div className="ui-auth__card">
          <div className="ui-auth__heading">
            <h1>{t('Create account')}</h1>
            <p className="ui-muted">{t('New accounts start with the user role.')}</p>
          </div>

          <Alert>{submitError}</Alert>

          <form className="ui-stack" onSubmit={handleSubmit(submit)} noValidate>
            <Field label={t('Name')} htmlFor="register-name" error={errors.name?.message}>
              <Input
                id="register-name"
                autoComplete="name"
                autoFocus
                maxLength={80}
                {...register('name')}
              />
            </Field>

            <Field label={t('Email')} htmlFor="register-email" error={errors.email?.message}>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
            </Field>

            <Field
              label={t('Password')}
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
              label={t('Interests')}
              htmlFor="register-interests"
              hint={t('Comma-separated. Used by the admin interests view.')}
              error={errors.interests?.message}
            >
              <Input
                id="register-interests"
                placeholder={t('e.g. chess')}
                {...register('interests')}
              />
            </Field>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('Creating account…') : t('Create account')}
            </Button>
          </form>

          <p className="ui-muted ui-small">
            {t('Already registered?')} <Link to="/login">{t('Log in here')}</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
