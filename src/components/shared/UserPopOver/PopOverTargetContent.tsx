import { Avatar, Text } from '@mantine/core';
import classes from './PopOverTargetContent.module.css';
import { useAppSelector } from '@/store';

export default function PopOverTargetContent() {
  const { firstName, lastName } = useAppSelector((state) => state.auth.user);
  // const firstNameInitial = firstName![0];
  // const lastNameInitial = lastName![0];

  return (
    <>
      <div className={classes.contentWrapper}>
        <Avatar color={'blue'} radius={'lg'}>
          {firstName || ''} {lastName || ''}
        </Avatar>
        <div>
          <Text style={{ fontWeight: 'bold' }} size='md'>
            {firstName || ''} {lastName || ''}
          </Text>
        </div>
      </div>
    </>
  );
}
