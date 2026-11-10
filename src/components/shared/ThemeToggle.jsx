import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../app/ThemeProvider.jsx';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      className="ui-icon-button"
      onClick={toggleTheme}
      aria-label={t('Toggle theme')}
      title={t('Toggle theme')}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
