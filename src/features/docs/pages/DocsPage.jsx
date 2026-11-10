import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { DocsView } from '../components/DocsView.jsx';

export function DocsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t('Documentation')}
        description={t('Product guides for using the notes application.')}
        path="/docs"
      />
      <PageHeader
        title={t('Documentation')}
        description={t('Product guides for using the notes application.')}
      />
      <DocsView scope="user" />
    </>
  );
}
