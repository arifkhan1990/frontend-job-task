import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = i18n.language === 'bn' ? 'বাংলা' : 'English';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="ui-icon-button"
          aria-label={t('Change language')}
          title={t('Change language')}
        >
          <Languages size={18} aria-hidden="true" />
          <span className="ui-icon-button__label">{current}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="ui-menu" sideOffset={8} align="end">
          <DropdownMenu.Item
            className="ui-menu__item"
            onSelect={() => i18n.changeLanguage('en')}
          >
            {t('English')}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="ui-menu__item"
            onSelect={() => i18n.changeLanguage('bn')}
          >
            {t('বাংলা')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
