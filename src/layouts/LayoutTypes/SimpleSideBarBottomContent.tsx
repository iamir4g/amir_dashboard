import classes from '@/layouts/LayoutTypes/SimpleSideBar.module.css';
import useAuth from '@/features/auth/hooks/useAuth';
import UserPopOver from '@/components/shared/UserPopOver/UserPopOver';
import { IconLogout } from '@tabler/icons-react';

export default function SimpleSideBarBottomContent() {
  const { signOut } = useAuth();

  return (
    <>
      <UserPopOver />
      <div
        className={classes.link}
        onClick={(event) => {
          signOut();
        }}
      >
        <IconLogout className={classes.icon} />
        <span>Exit</span>
      </div>
    </>
  );
}
