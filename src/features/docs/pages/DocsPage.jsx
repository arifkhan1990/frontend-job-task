import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';

const GUIDE_KEYS = [
  'My notes',
  'Users',
  'Users by interest',
  'Posts',
];

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
      <div className="ui-docs-links">
        {GUIDE_KEYS.map((key) => (
          <Link to={`/docs#${key.toLowerCase().replaceAll(' ', '-')}`} key={key}>
            {t(key)}
          </Link>
        ))}
      </div>
      <div className="ui-docs-content ui-stack">
        <section className="ui-card" id="my-notes">
          <h2>{t('My notes')}</h2>
          <p className="ui-muted">{t('Create, edit and delete your private notes.')}</p>
        </section>
        <section className="ui-card" id="users">
          <h2>{t('Users')}</h2>
          <p className="ui-muted">{t('Create accounts, update roles and remove users.')}</p>
        </section>
        <section className="ui-card" id="users-by-interest">
          <h2>{t('Users by interest')}</h2>
          <p className="ui-muted">{t('A single aggregation pipeline groups users by each interest.')}</p>
        </section>
        <section className="ui-card" id="posts">
          <h2>{t('Posts')}</h2>
          <p className="ui-muted">{t('Public posts. Anyone can read this page.')}</p>
        </section>
      </div>
    </>
  );
}
