'use client';
import { Center, Image, Text, Flex, useToast } from '@chakra-ui/react';
// import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useHeaderConfig } from '@/hooks/useConfig';
import IconSvg from '../IconSvg';
// import { WEVSITE_URL } from '@/constants';
// import Language from '../Language';

const Header = () => {
  return (
    <Center
      bg={'black'}
      justifyContent={'space-between'}
      maxW={'600px'}
      pos={'fixed'}
      px={6}
      py={4}
      top={0}
      w={'full'}
      zIndex={'tooltip'}
    >
      <Image
        alt=""
        h={'40px'}
        src="/assets/img/logo.png?1.0.0"
        w={'40px'}
      />
      <ConnectButton />
    </Center>
  );
};

export const NavBar = ({ text }: { text: string }) => {
  const router = useRouter();
  const t = useTranslations('Home');

  return (
    <Center
      bg={'black'}
      justifyContent={'space-between'}
      maxW={'600px'}
      pos={'fixed'}
      px={6}
      py={4}
      top={0}
      w={'full'}
      zIndex={'tooltip'}
    >
      <IconSvg
        boxSize={6}
        name="back"
        onClick={() => router.back()}
      />
      <Center
        flex={1}
        fontSize={'md'}
      >
        {t(text)}
      </Center>
      <ConnectButton accountStatus={'avatar'} />
    </Center>
  );
};

export default Header;

export const Banner = () => {
  const { locale } = useParams();
  const path = usePathname();
  const list = useHeaderConfig();

  const toast = useToast();
  const t = useTranslations();

  const handComeSoon = useCallback(
    (path: string) => {
      !path &&
        toast({
          title: t('coming soon'),
          status: 'success'
        });
    },
    [toast, t]
  );

  return (
    <Flex gap={10}>
      {list.map((item, index) => {
        return (
          <Link
            href={item.path}
            key={index}
            onClick={() => handComeSoon(item.path)}
          >
            <Text
              _hover={{
                color: 'white'
              }}
              color={
                (item.path === '/' && item.path === path) ||
                (item.path !== '/' &&
                  path.indexOf(
                    `${locale !== 'en' ? '/' + locale : ''}${item.path}`
                  ) !== -1)
                  ? 'white'
                  : 'whiteAlpha.500'
              }
              fontFamily={'300'}
              fontSize={{
                md: 'sm'
              }}
              lineHeight={'5'}
              transitionDuration={'normal'}
            >
              {item.name}
            </Text>
          </Link>
        );
      })}
    </Flex>
  );
};
