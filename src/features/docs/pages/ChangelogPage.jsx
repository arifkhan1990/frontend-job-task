import { useTranslation } from 'react-i18next';
import changelog from '../../../../CHANGELOG.md?raw';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Markdown } from '../components/Markdown.jsx';

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
      <Markdown className="ui-docs-article">{changelog}</Markdown>
    </>
  );
}
