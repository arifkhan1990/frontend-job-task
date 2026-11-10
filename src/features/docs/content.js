import admin from '../../../docs/user/admin.md?raw';
import faq from '../../../docs/user/faq.md?raw';
import gettingStarted from '../../../docs/user/getting-started.md?raw';
import notes from '../../../docs/user/notes.md?raw';
import posts from '../../../docs/user/posts.md?raw';
import troubleshooting from '../../../docs/user/troubleshooting.md?raw';
import api from '../../../docs/dev/api.md?raw';
import architecture from '../../../docs/dev/architecture.md?raw';
import auth from '../../../docs/dev/auth.md?raw';
import database from '../../../docs/dev/database.md?raw';
import decisions from '../../../docs/dev/decisions.md?raw';
import deployment from '../../../docs/dev/deployment.md?raw';
import testing from '../../../docs/dev/testing.md?raw';

const USER_ORDER = ['getting-started', 'notes', 'admin', 'posts', 'faq', 'troubleshooting'];
const DEV_ORDER = ['architecture', 'api', 'database', 'auth', 'testing', 'deployment', 'decisions'];

const USER_CONTENT = {
  'getting-started': gettingStarted,
  notes,
  admin,
  posts,
  faq,
  troubleshooting,
};

const DEV_CONTENT = {
  architecture,
  api,
  database,
  auth,
  testing,
  deployment,
  decisions,
};

function titleOf(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

function buildDocs(order, content) {
  return order.map((slug) => ({
    slug,
    title: titleOf(content[slug], slug),
    content: content[slug],
  }));
}

export const userDocs = buildDocs(USER_ORDER, USER_CONTENT);
export const devDocs = buildDocs(DEV_ORDER, DEV_CONTENT);

export function getDocs(scope) {
  return scope === 'dev' ? devDocs : userDocs;
}
