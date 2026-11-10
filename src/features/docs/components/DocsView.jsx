import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APP_VERSION } from '../../../config.js';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { getDocs } from '../content.js';
import { Markdown, slugify } from './Markdown.jsx';

export function DocsView({ scope = 'user' }) {
  const { t } = useTranslation();
  const docs = useMemo(() => getDocs(scope), [scope]);
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return docs.some((doc) => doc.slug === hash) ? hash : docs[0]?.slug;
  });

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace('#', '');
      const match = docs.find((doc) => doc.slug === hash);

      if (match) {
        setActiveSlug(match.slug);
      }
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [docs]);

  const filteredDocs = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return docs;
    }

    return docs.filter((doc) =>
      `${doc.title} ${doc.content}`.toLowerCase().includes(needle),
    );
  }, [docs, query]);

  useEffect(() => {
    if (
      query.trim() &&
      filteredDocs.length > 0 &&
      !filteredDocs.some((doc) => doc.slug === activeSlug)
    ) {
      setActiveSlug(filteredDocs[0].slug);
    }
  }, [query, filteredDocs, activeSlug]);

  const activeDoc = docs.find((doc) => doc.slug === activeSlug) || docs[0];
  const headings = useMemo(
    () =>
      (activeDoc?.content || '')
        .split('\n')
        .filter((line) => /^##\s+/.test(line))
        .map((line) => line.replace(/^##\s+/, '').trim()),
    [activeDoc],
  );

  function selectDoc(slug) {
    setActiveSlug(slug);
    window.history.replaceState(null, '', `#${slug}`);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="ui-docs-layout">
      <aside className="ui-docs-sidebar">
        <label className="ui-table-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">{t('Search documentation')}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('Search…')}
          />
        </label>

        <nav className="ui-docs-nav" aria-label={t('Documentation')}>
          {filteredDocs.map((doc) => (
            <button
              key={doc.slug}
              type="button"
              className={doc.slug === activeDoc?.slug ? 'active' : undefined}
              onClick={() => selectDoc(doc.slug)}
            >
              {doc.title}
            </button>
          ))}
        </nav>

        <div className="ui-docs-sidebar__meta">
          <span>{t('Version {{version}}', { version: APP_VERSION })}</span>
          <Link to="/changelog">{t('Changelog')}</Link>
        </div>
      </aside>

      {filteredDocs.length === 0 ? (
        <EmptyState title={t('No documents match your search.')} />
      ) : activeDoc ? (
        <Markdown className="ui-docs-article">{activeDoc.content}</Markdown>
      ) : null}

      {headings.length > 0 && filteredDocs.length > 0 ? (
        <aside className="ui-docs-toc">
          <p>{t('On this page')}</p>
          <ul>
            {headings.map((heading) => (
              <li key={heading}>
                <a href={`#${slugify(heading)}`}>{heading}</a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
