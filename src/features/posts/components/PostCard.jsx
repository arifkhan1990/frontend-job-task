import { CalendarDays, Globe2 } from 'lucide-react';
import { formatDate, formatRelativeDate } from '../../../utils/date.js';

export function PostCard({ post }) {
  return (
    <article className="ui-post-card">
      <div className="ui-post-card__meta">
        <span className="ui-post-card__badge">
          <Globe2 size={13} aria-hidden="true" />
          Public post
        </span>
        <time
          className="ui-post-card__date"
          dateTime={post.createdAt}
          title={formatDate(post.createdAt)}
        >
          <CalendarDays size={14} aria-hidden="true" />
          {formatRelativeDate(post.createdAt)}
        </time>
      </div>

      <h2>{post.title}</h2>
      <p className="ui-post-card__content">{post.content}</p>
    </article>
  );
}
