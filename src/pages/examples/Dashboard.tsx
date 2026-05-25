import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store';

export default function Dashboard() {
  const { t } = useTranslation();
  const locale = useAppSelector((state) => state.locale.currentLang);
  const isRtl = locale.toLowerCase().startsWith('fa');

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: isRtl ? 'row-reverse' : 'row',
          alignItems: 'center',
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
