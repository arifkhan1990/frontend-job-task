import { Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../components/shared/EmptyState.jsx';
import { Seo } from '../components/shared/Seo.jsx';
import { LinkButton } from '../components/ui/Button.jsx';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('Page not found')} path="/404" noIndex />
      <EmptyState
        icon={Compass}
        title={t('Page not found')}
        description={t('The page you requested does not exist.')}
        action={<LinkButton to="/">{t('Back to notes')}</LinkButton>}
      />
    </>
  );
}
