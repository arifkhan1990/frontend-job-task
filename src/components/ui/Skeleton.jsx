import { cn } from '../../utils/cn.js';

export function Skeleton({ className, width, height }) {
  return (
    <span
      className={cn('ui-skeleton', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="ui-table-skeleton" aria-hidden="true">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div className="ui-table-skeleton__row" key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton
              className="ui-table-skeleton__cell"
              key={columnIndex}
              height="14px"
              width={columnIndex === 0 ? '32%' : '18%'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
