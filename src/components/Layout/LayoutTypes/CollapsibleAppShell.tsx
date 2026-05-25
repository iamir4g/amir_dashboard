import { AppShell, AppShellSection, Box, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import navigationConfig from '@/configs/navigation.config';
import AuthorityCheck from '@/route/AuthorityCheck';
import { LinksGroup } from '@/components/Layout/LinksGroup';
import { Link, useNavigate } from 'react-router-dom';
import classes from '@/components/Layout/LayoutTypes/SimpleSideBar.module.css';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { useTranslation } from 'react-i18next';
import Views from '@/components/Layout/Views';
import CollapsibleAppShellBottomContent from '@/components/Layout/LayoutTypes/CollapsibleAppShellBottomContent';

export default function CollapsibleAppShell() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const userAuthority = useAppSelector((state) => state.auth.user.role);
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    setActive(currentPath);
  }, [location.pathname]);

  const links = navigationConfig.map((item, index) => {
    let links = [];

    if (item.subMenu && item.subMenu.length > 0) {
      links = item.subMenu.map((i) => ({
        label: i.title,
        link: i.path,
        authority: i.authority,
      }));
      const isAnyLinkActive = links.some((link) => location.pathname.includes(link.link));

      return (
        <AuthorityCheck userAuthority={userAuthority || []} authority={item.authority} key={index}>
          <Box style={{ marginInlineStart: 10 }} my={10}>
            <LinksGroup
              initiallyOpened={isAnyLinkActive}
              icon={item.icon}
              label={item.translateKey ? t(item.translateKey) : item.title}
              links={links}
            />
          </Box>
        </AuthorityCheck>
      );
    } else {
      return (
        <AuthorityCheck userAuthority={userAuthority || []} authority={item.authority} key={index}>
          <Link
            className={classes.link}
            data-active={item.path.split('/')[1] === active ? 'true' : undefined}
            to={item.path}
            onClick={(event) => {
              event.preventDefault();
              setActive(item.path.split('/')[1]);
              navigate(item.path);
            }}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.translateKey ? t(item.translateKey) : item.title}</span>
          </Link>
        </AuthorityCheck>
      );
    }
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: {
          mobile: !mobileOpened,
          desktop: !desktopOpened,
        },
      }}
      padding="md"
      style={{ direction: 'rtl' }}
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <img
            src="/logo/carmode.jpeg"
            alt="carmode"
            style={{ height: 30, width: 'auto', display: 'block' }}
          />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow>{links}</AppShell.Section>
        <AppShell.Section>
          <CollapsibleAppShellBottomContent />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main style={{ direction: 'rtl' }}>
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            direction: 'rtl',
            textAlign: 'right',
            width: '100%',
          }}
        >
          <Views />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
