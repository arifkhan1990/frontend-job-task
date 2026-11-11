import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingState } from './components/shared/LoadingState.jsx';
import { ProtectedRoute } from './components/shared/ProtectedRoute.jsx';
import { AppShell } from './components/shared/AppShell.jsx';
import { AuthLayout } from './features/auth/AuthLayout.jsx';
import { DocsLayout } from './features/docs/DocsLayout.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const LoginPage = lazy(() =>
  import('./features/auth/pages/LoginPage.jsx').then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import('./features/auth/pages/RegisterPage.jsx').then((module) => ({
    default: module.RegisterPage,
  })),
);
const NotesPage = lazy(() =>
  import('./features/notes/pages/NotesPage.jsx').then((module) => ({
    default: module.NotesPage,
  })),
);
const AllNotesPage = lazy(() =>
  import('./features/notes/pages/AllNotesPage.jsx').then((module) => ({
    default: module.AllNotesPage,
  })),
);
const UsersPage = lazy(() =>
  import('./features/users/pages/UsersPage.jsx').then((module) => ({
    default: module.UsersPage,
  })),
);
const InterestsPage = lazy(() =>
  import('./features/interests/pages/InterestsPage.jsx').then((module) => ({
    default: module.InterestsPage,
  })),
);
const UserPostsPage = lazy(() =>
  import('./features/posts/pages/UserPostsPage.jsx').then((module) => ({
    default: module.UserPostsPage,
  })),
);
const DocsPage = lazy(() =>
  import('./features/docs/pages/DocsPage.jsx').then((module) => ({
    default: module.DocsPage,
  })),
);
const DevDocsPage = lazy(() =>
  import('./features/docs/pages/DevDocsPage.jsx').then((module) => ({
    default: module.DevDocsPage,
  })),
);
const ChangelogPage = lazy(() =>
  import('./features/docs/pages/ChangelogPage.jsx').then((module) => ({
    default: module.ChangelogPage,
  })),
);

export function App() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<DocsLayout />}>
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route
            path="/dev/docs"
            element={
              <ProtectedRoute admin>
                <DevDocsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<AppShell />}>
          <Route path="/users/:id/posts" element={<UserPostsPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute admin>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notes"
            element={
              <ProtectedRoute admin>
                <AllNotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/interests"
            element={
              <ProtectedRoute admin>
                <InterestsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
