import React, { useEffect, useState } from 'react';
import { UnstyledButton, Tooltip, Title, rem } from '@mantine/core';
import classes from './DeckedSideBar.module.css';
import SimpleSideBarBottomContent from '@/layouts/LayoutTypes/SimpleSideBarBottomContent';
import navigationConfig from '@/routes/navigation';
import { Link, useLocation } from 'react-router-dom';
import Views from '@/layouts/Views';
import { useTranslation } from 'react-i18next';
import AuthorityCheck from '@/routes/AuthorityCheck';
import { useAppSelector } from '@/store';

function DeckedSideBarContent() {
  const [activeMainLink, setActiveMainLink] = useState('');
  const [activeSubLink, setActiveSubLink] = useState('');
  const [title, setTitle] = useState('');
  const location = useLocation();
  const { t } = useTranslation();
  const userAuthority = useAppSelector((state) => state.auth.user.role);

  useEffect(() => {
    const currentPath = location.pathname.split('/');
    const currentMainLink = currentPath[1];
    const currentSubLink = currentPath[2];

    setActiveMainLink(currentMainLink);
    setActiveSubLink(currentSubLink);
    const currentMainPath = `/${currentMainLink}`;
    const navItem = navigationConfig.find((i) => i.path === currentMainPath);
    if (navItem) {
      setTitle(navItem.translateKey ? t(navItem.translateKey) : navItem.title);
    } else {
      setTitle(currentMainLink);
    }
  }, [location.pathname]);

  const handleMainLinkClick = (mainLink: string, title: string, translateKey: string) => {
    setActiveMainLink(mainLink.split('/')[1]);
    setTitle(translateKey ? t(translateKey) : title);
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div>
            <img className={classes.logo} alt={'carmode'} src={'/logo/carmode.jpeg'} />
          </div>
          <div style={{ overflowY: 'auto' }}>
            {navigationConfig.map((link, index) => (
              <AuthorityCheck
                userAuthority={userAuthority ? userAuthority : []}
                authority={link.authority}
              >
                <Tooltip
                  label={link.translateKey ? t(link.translateKey) : link.title}
                  position='left'
                  withArrow
                  transitionProps={{ duration: 0 }}
                  key={index}
                >
                  <UnstyledButton
                    onClick={() => handleMainLinkClick(link.path, link.title, link.translateKey)}
                    className={classes.mainLink}
                    data-active={link.path.split('/')[1] === activeMainLink || undefined}
                  >
                    <link.icon
                      style={{
                        width: rem(22),
                        height: rem(22),
                      }}
                      stroke={1.5}
                    />
                  </UnstyledButton>
                </Tooltip>
              </AuthorityCheck>
            ))}
          </div>
        </div>
        <div className={classes.main}>
          <div>
            <div className={classes.stickyTitle}>
              <Title order={4} className={classes.title}>
                {title}
              </Title>
            </div>
            <div>
              {navigationConfig.map((link, index) => (
                <div
                  key={index}
                  style={{ display: link.path.split('/')[1] === activeMainLink ? 'block' : 'none' }}
                >
                  {link.subMenu?.map((submenuItem) => {
                    const targetPath = submenuItem.path.startsWith('/')
                      ? submenuItem.path
                      : `${link.path}/${submenuItem.path}`;

                    return (
                      <AuthorityCheck
                        userAuthority={userAuthority ? userAuthority : []}
                        authority={submenuItem.authority}
                        key={submenuItem.key}
                      >
                        <Link
                          to={targetPath}
                          className={classes.link}
                          data-active={targetPath === location.pathname || undefined}
                        >
                          {submenuItem.translateKey
                            ? t(submenuItem.translateKey)
                            : submenuItem.title}
                        </Link>
                      </AuthorityCheck>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className={classes.sideBarBottomContent}>
            <SimpleSideBarBottomContent />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function DeckedSideBar() {
  return (
    <div
      style={{
        overflow: 'hidden',
        backgroundColor: 'rgb(236,236,236)',
        display: 'flex',
        flex: '1 1 auto',
        height: '100vh',
      }}
    >
      <DeckedSideBarContent />
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'rgb(241,240,240)',
          flex: 1,
        }}
      >
        <Views />
      </div>
    </div>
  );
}
