import { Avatar, Text } from '@mantine/core';
import classes from './CollapsedUserPopOverContent.module.css';
import { useAppSelector } from '@/store';

export default function CollapsedUserPopOverContent() {
  const { firstName, lastName, nickname, phone } = useAppSelector((state) => state.auth.user);
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || nickname || 'کاربر';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return (
    <>
      <div className={classes.contentWrapper}>
        <Avatar color={'blue'} radius={'lg'}>
          {initials || '?'}
        </Avatar>
        <div>
          <Text style={{ fontWeight: 'bold' }} size='md'>
            {fullName}
          </Text>
          <Text size='xs'>{phone}</Text>
        </div>
      </div>
    </>
  );
}
