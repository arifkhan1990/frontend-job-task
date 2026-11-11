import { Compass } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState.jsx';
import { Seo } from '../components/shared/Seo.jsx';
import { LinkButton } from '../components/ui/Button.jsx';

export function NotFoundPage() {

  return (
    <>
      <Seo title={'Page not found'} path="/404" noIndex />
      <EmptyState
        icon={Compass}
        title={'Page not found'}
        description={'The page you requested does not exist.'}
        action={<LinkButton to="/">{'Back to notes'}</LinkButton>}
      />
    </>
  );
}
