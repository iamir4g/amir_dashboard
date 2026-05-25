import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div
        className="flex items-center"
        style={{
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <img src="/logo/carmode.jpeg" alt="carmode" style={{ height: 40, width: 'auto' }} />
        <div style={{ fontWeight: 600 }}>{t('pages.dashboard')}</div>
      </div>
    </div>
  );
}
