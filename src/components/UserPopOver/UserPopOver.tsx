import { Popover, Text } from '@mantine/core';
import { useState } from 'react';
import PopOverTargetContent from '@/components/UserPopOver/PopOverTargetContent';
import { useTranslation } from 'react-i18next';

export default function UserPopOver() {
  const [displayPopOver, setDisplayPopOver] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <div>
      <Popover
        width={200}
        position='left'
        opened={displayPopOver}
        offset={{ mainAxis: 13, crossAxis: 0 }}
      >
        <Popover.Target>
          <div onClick={() => setDisplayPopOver((prevState) => !prevState)}>
            <PopOverTargetContent />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size='xs'>{t('ui.profileHint')}</Text>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
