import { Skeleton } from '../ui/Skeleton.jsx';

export function NoteSkeletonGrid({ count = 3 }) {
  return (
    <div className="ui-note-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="ui-note-card ui-note-skeleton" key={index}>
          <Skeleton width="70%" height="22px" />
          <Skeleton width="100%" height="14px" />
          <Skeleton width="92%" height="14px" />
          <Skeleton width="60%" height="14px" />
          <div className="ui-note-skeleton__meta">
            <Skeleton width="36%" height="12px" />
            <Skeleton width="30%" height="28px" />
          </div>
        </div>
      ))}
    </div>
  );
}
