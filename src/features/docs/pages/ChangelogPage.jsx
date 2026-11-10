import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { APP_VERSION } from '../../../config.js';

export function ChangelogPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t('Changelog')}
        description={t('Release history for the frontend and API.')}
        path="/changelog"
      />
      <PageHeader
        title={t('Changelog')}
        description={t('Release history for the frontend and API.')}
      />
      <section className="ui-card">
        <h2>{t('Version {{version}}', { version: APP_VERSION })}</h2>
        <p className="ui-muted">
          Frontend and API are versioned together. The full changelog is maintained in
          the repository.
        </p>
      </section>
    </>
  );
}
