import { FileText, PenLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatApiError } from '../../../api/client.js';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { ErrorState } from '../../../components/shared/ErrorState.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Button, LinkButton } from '../../../components/ui/Button.jsx';
import { Pagination } from '../../../components/ui/Pagination.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { PostCard } from '../components/PostCard.jsx';
import { PostDialog } from '../components/PostDialog.jsx';
import { PostHero } from '../components/PostHero.jsx';
import { PostSkeletonList } from '../components/PostSkeletonList.jsx';
import { useUserPosts } from '../hooks.js';

export function UserPostsPage() {
  const { id } = useParams();
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
        title={postUser ? `Posts by ${postUser.name}` : 'Posts'}
        description={'Public posts. Anyone can read this page.'}
        path={`/users/${id}/posts`}
      />

      <div className="ui-posts-page">
        <PostHero
          user={postUser}
          totalPosts={meta?.total}
          isOwnProfile={isOwnProfile}
          isError={postsQuery.isError}
          onCreate={() => setDialogOpen(true)}
        />

        {!currentUser ? (
          <div className="ui-post-login-note">
            <div>
              <strong>Want to write?</strong>{' '}
              <span className="ui-muted">
                Log in to publish posts on your own profile.
              </span>
            </div>
            <LinkButton to="/login" variant="secondary" size="sm">
              Log in
            </LinkButton>
          </div>
        ) : null}

        {postsQuery.isLoading ? <PostSkeletonList /> : null}

        {!postsQuery.isLoading && postsQuery.isError ? (
          <ErrorState
            message={formatApiError(postsQuery.error)}
            onRetry={postsQuery.refetch}
          />
        ) : null}

        {!postsQuery.isLoading && !postsQuery.isError && posts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={isOwnProfile ? 'Your journal is empty' : 'No public posts yet'}
            description={
              isOwnProfile
                ? 'Write your first post — it will be visible on your public profile.'
                : 'This user has not published anything yet.'
            }
            action={
              isOwnProfile ? (
                <Button onClick={() => setDialogOpen(true)}>
                  <PenLine size={16} aria-hidden="true" />
                  Write your first post
                </Button>
              ) : null
            }
          />
        ) : null}

        {posts.length > 0 ? (
          <div className="ui-post-feed">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : null}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>

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
