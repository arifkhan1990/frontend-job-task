import changelog from '../../../../CHANGELOG.md?raw';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Markdown } from '../components/Markdown.jsx';

const changelogBody = changelog.replace(/^# Changelog\s*\n+/, '');

export function ChangelogPage() {

  return (
    <>
      <Seo
        title={'Changelog'}
        description={'Release history for the frontend and API.'}
        path="/changelog"
      />
      <PageHeader
        title={'Changelog'}
        description={'Release history for the frontend and API.'}
      />
      <Markdown className="ui-docs-article">{changelogBody}</Markdown>
    </>
  );
}
