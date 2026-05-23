import { useTranslation } from 'react-i18next';

export default function Users() {
  const { t } = useTranslation();

  return <>{t('pages.users')}</>;
}
