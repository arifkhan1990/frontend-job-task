import { Skeleton } from '../../../components/ui/Skeleton.jsx';

export function PostSkeletonList({ count = 3 }) {
  return (
    <div className="ui-post-feed" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="ui-post-card ui-post-skeleton" key={index}>
          <Skeleton width="32%" height="14px" />
          <Skeleton width="72%" height="26px" />
          <Skeleton width="100%" height="14px" />
          <Skeleton width="94%" height="14px" />
          <Skeleton width="64%" height="14px" />
        </div>
      ))}
    </div>
  );
}
