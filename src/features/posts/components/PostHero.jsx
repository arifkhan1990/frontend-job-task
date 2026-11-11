import { Plus } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { initials } from '../../../utils/initials.js';

export function PostHero({ user, totalPosts, isOwnProfile, onCreate, isError = false }) {
  const totalLabel = isError
    ? 'Posts unavailable'
    : totalPosts === null || totalPosts === undefined
      ? 'Loading posts…'
      : `${totalPosts} public ${totalPosts === 1 ? 'post' : 'posts'}`;

  return (
    <section className="ui-post-hero">
      <div className="ui-post-hero__identity">
        <span className="ui-avatar ui-post-avatar" aria-hidden="true">
          {initials(user?.name || '?')}
        </span>
        <div>
          <p className="ui-eyebrow">Public journal</p>
          <h1>{user ? `Posts by ${user.name}` : 'Posts'}</h1>
          <p className="ui-muted">{totalLabel}</p>
        </div>
      </div>

      <div className="ui-post-hero__actions">
        {isOwnProfile ? <Badge tone="success">Your profile</Badge> : null}
        {isOwnProfile ? (
          <Button onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            New post
          </Button>
        ) : null}
      </div>
    </section>
  );
}
