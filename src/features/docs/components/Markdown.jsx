import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function textOf(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textOf).join('');
  }

  if (node?.props?.children) {
    return textOf(node.props.children);
  }

  return '';
}

const components = {
  // The page header owns the single h1; document titles are rendered as h2.
  h1: ({ node: _node, children, ...props }) => (
    <h2 id={slugify(textOf(children))} {...props}>
      {children}
    </h2>
  ),
  h2: ({ node: _node, children, ...props }) => (
    <h2 id={slugify(textOf(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ node: _node, children, ...props }) => (
    <h3 id={slugify(textOf(children))} {...props}>
      {children}
    </h3>
  ),
  a: ({ node: _node, href = '', children, ...props }) => {
    if (href.startsWith('/')) {
      return (
        <Link to={href} {...props}>
          {children}
        </Link>
      );
    }

    if (href.startsWith('#')) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  },
  img: ({ node: _node, alt = '', ...props }) => (
    <img loading="lazy" alt={alt} {...props} />
  ),
  table: ({ node: _node, children, ...props }) => (
    <div className="ui-docs-table" tabIndex={0}>
      <table {...props}>{children}</table>
    </div>
  ),
  pre: ({ node: _node, children, ...props }) => (
    <pre tabIndex={0} {...props}>
      {children}
    </pre>
  ),
};

export function Markdown({ children, className }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
