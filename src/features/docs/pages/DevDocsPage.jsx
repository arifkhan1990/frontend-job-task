import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { DocsView } from '../components/DocsView.jsx';

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
      <DocsView scope="dev" />
    </>
  );
}
