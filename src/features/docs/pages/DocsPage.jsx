import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { DocsView } from '../components/DocsView.jsx';

export function DocsPage() {

  return (
    <>
      <Seo
        title={'Documentation'}
        description={'Product guides for using the notes application.'}
        path="/docs"
      />
      <PageHeader
        title={'Documentation'}
        description={'Product guides for using the notes application.'}
      />
      <DocsView scope="user" />
    </>
  );
}
