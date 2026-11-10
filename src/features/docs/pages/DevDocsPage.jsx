import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';

export function DevDocsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('Developer docs')} path="/dev/docs" noIndex />
      <PageHeader
        title={t('Developer docs')}
        description={t(
          'Architecture, API, database, auth, testing and deployment notes.',
        )}
      />
      <div className="ui-docs-content ui-stack">
        <section className="ui-card">
          <h2>{t('Backend API docs')}</h2>
          <p className="ui-muted">
            <a href="/api/docs" target="_blank" rel="noreferrer">
              {t('Open API docs')}
            </a>
          </p>
        </section>
        <section className="ui-card">
          <h2>{t('Architecture')}</h2>
          <p className="ui-muted">
            React + Vite client, Express API, MongoDB replica set, JWT access tokens,
            rotating refresh cookies and role-based access control.
          </p>
        </section>
      </div>
    </>
  );
}
