import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { formatApiError } from '../../../api/client.js';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { ErrorState } from '../../../components/shared/ErrorState.jsx';
import { NoteSkeletonGrid } from '../../../components/shared/NoteSkeletonGrid.jsx';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Pagination } from '../../../components/ui/Pagination.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { PostDialog } from '../components/PostDialog.jsx';
import { useUserPosts } from '../hooks.js';
import { formatDate } from '../../../utils/date.js';

export function UserPostsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [id]);

  const postsQuery = useUserPosts(id, { page, limit: 10 });
  const postUser = postsQuery.data?.user;
  const posts = postsQuery.data?.posts || [];
  const meta = postsQuery.data?.meta;
  const isOwnProfile = currentUser?._id === id;

  return (
    <>
      <Seo
        title={postUser ? t('Posts by {{name}}', { name: postUser.name }) : t('Posts')}
        description={t('Public posts. Anyone can read this page.')}
        path={`/users/${id}/posts`}
      />
      <PageHeader
        title={
          postUser
            ? t('Posts by {{name}}', { name: postUser.name })
            : t('Posts')
        }
        description={t('Public posts. Anyone can read this page.')}
        actions={
          isOwnProfile ? (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} aria-hidden="true" />
              {t('New post')}
            </Button>
          ) : null
        }
      >
        {isOwnProfile ? <Badge tone="success">{t('Your profile')}</Badge> : null}
      </PageHeader>

      {!currentUser ? (
        <p className="ui-muted ui-small">
          {t('Log in to write posts on your own profile.')}{' '}
          <Link to="/login">{t('Log in')}</Link>
        </p>
      ) : null}

      {postsQuery.isLoading ? (
        <div role="status" aria-label={t('Loading…')}>
          <NoteSkeletonGrid />
        </div>
      ) : null}

      {!postsQuery.isLoading && postsQuery.isError ? (
        <ErrorState
          message={formatApiError(postsQuery.error, t)}
          onRetry={postsQuery.refetch}
        />
      ) : null}

      {!postsQuery.isLoading && !postsQuery.isError && posts.length === 0 ? (
        <EmptyState title={t('No posts yet.')} />
      ) : null}

      {posts.length > 0 ? (
        <div className="ui-note-grid">
          {posts.map((post) => (
            <article className="ui-note-card" key={post._id}>
              <h2>{post.title}</h2>
              <p className="ui-note-card__content">{post.content}</p>
              <div className="ui-note-card__meta">
                <span>{formatDate(post.createdAt, i18n.language)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Pagination meta={meta} onPageChange={setPage} />

      {isOwnProfile ? (
        <PostDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userId={id}
        />
      ) : null}
    </>
  );
}
