import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Breadcrumbs({ items = [] }) {

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="ui-breadcrumbs" aria-label={'Breadcrumb'}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span className="ui-breadcrumbs__item" key={`${item.label}-${index}`}>
            {index > 0 ? <ChevronRight size={14} aria-hidden="true" /> : null}
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
