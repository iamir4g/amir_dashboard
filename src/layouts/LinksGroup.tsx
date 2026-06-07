import { useEffect, useState } from 'react';
import { Badge, Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import classes from './LinksGroup.module.css';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const navigate = useNavigate();
  const [active, setActive] = useState('');
  const salesRequestsWaitingCount = useAppSelector((state) => state.base.common.salesRequestsWaitingCount);
  const openedRotation = 'rotate(90deg)';

  useEffect(() => {
    const currentPath = location.pathname;
    setActive(currentPath);
  }, [location.pathname]);

  const items = (hasLinks ? links : []).map((link) => {
    const shouldShowBadge =
      link.link === '/supply/sales-requests' && (salesRequestsWaitingCount ?? 0) > 0;
    return (
      <Text<'a'>
        component='a'
        data-active={link.link === active ? 'true' : undefined}
        className={classes.link}
        href={link.link}
        key={link.label}
        onClick={(event) => {
          navigate(link.link);
          event.preventDefault();
        }}
      >
        <Group justify='space-between' align='center' wrap='nowrap'>
          <span>{link.label}</span>
          {shouldShowBadge ? (
            <Badge color='red' variant='filled' size='sm' radius='xl'>
              {salesRequestsWaitingCount}
            </Badge>
          ) : null}
        </Group>
      </Text>
    );
  });

  return (
    <div style={{ marginBottom: '0.8rem' }}>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify='space-between' gap={5}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ThemeIcon variant='light' size={30}>
              <Icon
                style={{
                  width: rem(18),
                  height: rem(18),
                }}
              />
            </ThemeIcon>
            <Box style={{ marginInlineStart: rem(16) }}>{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronLeft
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? openedRotation : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </div>
  );
}
