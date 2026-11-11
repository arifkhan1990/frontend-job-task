import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../../config.js';

export function Seo({
  title,
  description,
  path = '/',
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title ? `${title} · ${'Notes API'}` : 'Notes API';
  const metaDescription = description || 'A focused workspace for private notes, public posts and admin views.';
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={'Notes API'} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
    </Helmet>
  );
}
