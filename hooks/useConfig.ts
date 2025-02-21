import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { IconName } from '@/components/IconSvg';

export const useHeaderConfig = () => {
  const t = useTranslations();
  const list = useMemo(
    () => [
      {
        name: t('USDS'),
        path: '/'
      },
      {
        name: t('Marketplace'),
        path: '/marketplace'
      },
      {
        name: t('Portfolio'),
        path: '/portfolio'
      },
      {
        name: t('Transactions'),
        path: '/transactions'
      }
    ],
    [t]
  );

  return list;
};

export const useFooterConfig = () => {
  const t = useTranslations();
  const linkList = useMemo(() => {
    return [
      {
        name: t('Whitepaper'),
        link: ''
      },
      {
        name: t('About us'),
        link: '',
        dialogKey: 'about'
      }
      // {
      //   name: t('Apply for issuance'),
      //   link: ''
      // }
    ];
  }, [t]);

  const rightList = useMemo(() => {
    return [
      {
        name: t('Terms of service'),
        link: '',
        dialogKey: 'service'
      },
      {
        name: t('Security auditing'),
        link: ''
      }
    ];
  }, [t]);

  const iconList = useMemo<Array<{ link: string; icon: IconName }>>(() => {
    return [
      {
        icon: 'github',
        link: ''
      },
      {
        icon: 'twitter',
        link: ''
      },
      {
        icon: 'medium',
        link: ''
      },
      {
        icon: 'telegram',
        link: ''
      },
      {
        icon: 'youtube',
        link: ''
      }
    ];
  }, []);

  return {
    linkList,
    rightList,
    iconList
  };
};
