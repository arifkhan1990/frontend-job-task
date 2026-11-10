import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BookOpen, FileText, History, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/AuthProvider.jsx';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="ui-user-menu__trigger"
          aria-label={t('Open user menu')}
        >
          <span className="ui-avatar" aria-hidden="true">
            {initials(user.name)}
          </span>
          <span className="ui-user-menu__name">{user.name}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="ui-menu" sideOffset={8} align="end">
          <div className="ui-menu__header">
            <strong>{user.name}</strong>
            <span className="ui-muted ui-small">{user.email}</span>
            <span className={`ui-badge ui-badge--${user.role}`}>{t(user.role === 'admin' ? 'Admin' : 'User')}</span>
          </div>
          <DropdownMenu.Separator className="ui-menu__separator" />
          <DropdownMenu.Item className="ui-menu__item" asChild>
            <Link to={`/users/${user._id}/posts`}>
              <FileText size={16} aria-hidden="true" />
              {t('My posts')}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="ui-menu__item" asChild>
            <Link to="/docs">
              <BookOpen size={16} aria-hidden="true" />
              {t('Documentation')}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="ui-menu__item" asChild>
            <Link to="/changelog">
              <History size={16} aria-hidden="true" />
              {t('Changelog')}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="ui-menu__separator" />
          <DropdownMenu.Item
            className="ui-menu__item ui-menu__item--danger"
            onSelect={(event) => {
              event.preventDefault();
              logout();
            }}
          >
            <LogOut size={16} aria-hidden="true" />
            {t('Log out')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
