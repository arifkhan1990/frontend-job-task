import {
  BarChart3,
  BookOpen,
  Code2,
  FileText,
  Files,
  History,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn.js';

const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

export function Sidebar({
  user,
  collapsed = false,
  onToggle,
  onNavigate,
  showToggle = true,
}) {
  const { t } = useTranslation();

  const sections = [
    {
      label: t('Workspace'),
      items: [
        { to: '/', label: t('My notes'), icon: NotebookPen, end: true },
        { to: `/users/${user._id}/posts`, label: t('My posts'), icon: FileText },
      ],
    },
  ];

  if (user.role === 'admin') {
    sections.push({
      label: t('Admin'),
      items: [
        { to: '/admin/users', label: t('Users'), icon: Users },
        { to: '/admin/notes', label: t('All notes'), icon: Files },
        { to: '/admin/interests', label: t('Users by interest'), icon: BarChart3 },
      ],
    });
  }

  sections.push({
    label: t('Resources'),
    items: [
      { to: '/docs', label: t('Documentation'), icon: BookOpen },
      ...(user.role === 'admin'
        ? [{ to: '/dev/docs', label: t('Developer docs'), icon: Code2 }]
        : []),
      { to: '/changelog', label: t('Changelog'), icon: History },
    ],
  });

  return (
    <aside className={cn('ui-sidebar', collapsed && 'ui-sidebar--collapsed')}>
      <div className="ui-sidebar__top">
        {!collapsed ? <span className="ui-sidebar__title">{t('Workspace')}</span> : null}
        {showToggle ? (
          <button
            type="button"
            className="ui-icon-button"
            onClick={onToggle}
            aria-label={t(collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            title={t(collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <nav className="ui-sidebar__nav" aria-label={t('Primary navigation')}>
        {sections.map((section) => (
          <div className="ui-sidebar__section" key={section.label}>
            <p className="ui-sidebar__section-label">
              {collapsed ? <span className="sr-only">{section.label}</span> : section.label}
            </p>
            <ul>
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={navClass}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span className={collapsed ? 'sr-only' : undefined}>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
