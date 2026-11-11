import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { DocsView } from '../components/DocsView.jsx';

export function DevDocsPage() {

  return (
    <>
      <Seo title={'Developer docs'} path="/dev/docs" noIndex />
      <PageHeader
        title={'Developer docs'}
        description="Architecture, API, database, auth, testing and deployment notes."
      />
      <DocsView scope="dev" />
    </>
  );
}
