import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminNotesPage } from './pages/AdminNotesPage.jsx';
import { AdminUsersPage } from './pages/AdminUsersPage.jsx';
import { InterestsPage } from './pages/InterestsPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { NotesPage } from './pages/NotesPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { UserPostsPage } from './pages/UserPostsPage.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <ProtectedRoute admin>
              <AdminNotesPage />
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
  );
}
