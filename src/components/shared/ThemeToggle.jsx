import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/ThemeProvider.jsx';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      className="ui-icon-button"
      onClick={toggleTheme}
      aria-label={'Toggle theme'}
      title={'Toggle theme'}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
