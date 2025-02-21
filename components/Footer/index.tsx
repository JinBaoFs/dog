'use client';

import {
  Flex,
  Center,
  Text,
  HStack,
  Show,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent
} from '@chakra-ui/react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Link } from '@/i18n/navigation';
import { useFooterConfig, useHeaderConfig } from '@/hooks/useConfig';
import { ajaxGet } from '@/api/axios';
import { axiosUrlType } from '@/api/type';
import REQUEST_API from '@/api/api';
import useCurrentLang from '@/hooks/useCurrentLang';
import IconSvg from '../IconSvg';
import Language from '../Language';

const LinkItem = ({
  name,
  link,
  onClick
}: {
  name: string;
  link: string;
  onClick: () => void;
}) => {
  return (
    <Link href={link}>
      <HStack
        _hover={{
          color: 'white'
        }}
        color={'gray.300'}
        fontSize={'sm'}
        gap={1}
        lineHeight={5}
        onClick={onClick}
        transitionDuration={'normal'}
      >
        <Text>{name}</Text>
        <IconSvg
          h={'16px'}
          name="link"
          w={'16px'}
        />
      </HStack>
    </Link>
  );
};

const FooterContent = () => {
  const { linkList, rightList, iconList } = useFooterConfig();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [item, setItem] = useState({
    name: '',
    content: ''
  });

  const { data: aboutData } = useSWR<{ about: string; about_zh: string }>(
    `${REQUEST_API.agreementAbout}`,
    url => ajaxGet(url as axiosUrlType),
    {
      revalidateOnFocus: false
    }
  );

  const { data: serviceData } = useSWR<{ content: string; content_zh: string }>(
    `${REQUEST_API.service}`,
    url => ajaxGet(url as axiosUrlType),
    {
      revalidateOnFocus: false
    }
  );

  const currentLang = useCurrentLang();

  const handleItem = useCallback(
    async (item?: { name: string; dialogKey?: string }) => {
      if (!item?.dialogKey) return;
      setItem({
        name: item.name,
        content: (item?.dialogKey === 'about'
          ? aboutData?.[currentLang === 'zh' ? 'about_zh' : 'about']
          : serviceData?.[
              currentLang === 'zh' ? 'content_zh' : 'content'
            ]) as string
      });
      onOpen();
    },
    [onOpen, aboutData, currentLang, serviceData]
  );

  return (
    <>
      <Modal
        autoFocus={false}
        isCentered
        isOpen={isOpen}
        motionPreset="slideInBottom"
        onClose={onClose}
        scrollBehavior={'inside'}
        size={{ base: 'full', md: 'xl' }}
      >
        <ModalOverlay />

        <ModalContent
          bg={'black.200'}
          w={{ base: 'full', md: '919px' }}
        >
          <ModalHeader fontSize={'md'}>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            className="modal-body"
            color={'gray.600'}
          >
            <Box
              dangerouslySetInnerHTML={{ __html: item?.content || '' }}
            ></Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex
        bottom={8}
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent={'space-between'}
        left={0}
        pos={{ md: 'fixed' }}
        px={{
          base: 0,
          md: 8
        }}
        w={'full'}
      >
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          gap={4}
          mb={{ base: '4', md: '0' }}
        >
          {linkList.map((item, index) => {
            return (
              <LinkItem
                key={index}
                onClick={() => handleItem(item)}
                {...item}
              />
            );
          })}
        </Flex>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          gap={4}
        >
          {rightList.map((item, index) => {
            return (
              <LinkItem
                key={index}
                onClick={() => handleItem(item)}
                {...item}
              />
            );
          })}

          <Center
            gap={4}
            justifyContent={'space-between'}
          >
            {iconList.map((item, index) => {
              return (
                <IconSvg
                  _hover={{
                    color: 'white'
                  }}
                  boxSize={'4'}
                  color={'gray.300'}
                  cursor={'pointer'}
                  gap={4}
                  key={index + 'icon'}
                  name={item.icon}
                  transitionDuration={'normal'}
                />
              );
            })}
          </Center>
        </Flex>
      </Flex>
    </>
  );
};

const Footer = () => {
  const { locale } = useParams();
  const list = useHeaderConfig();
  const path = usePathname();

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
    <>
      <Show
        above="md"
        ssr
      >
        <FooterContent />
      </Show>

      <Show
        below="md"
        ssr
      >
        <Center
          backdropFilter={'blur(5px)'}
          bg={'blackAlpha.400'}
          border={'1px solid'}
          borderColor={'whiteAlpha.100'}
          borderRadius={'2xl'}
          bottom={2}
          fontSize={'sm'}
          height={'52px'}
          justifyContent={'space-between'}
          left={2}
          p={4}
          pos={'fixed'}
          right={2}
          zIndex={'9'}
        >
          <Popover
            gutter={20}
            placement="top"
            strategy="fixed"
          >
            <PopoverTrigger>
              <Box>
                <IconSvg
                  _hover={{
                    color: 'white'
                  }}
                  boxSize={'4'}
                  color={'gray.300'}
                  cursor={'pointer'}
                  gap={4}
                  name="top"
                  transitionDuration={'normal'}
                />
              </Box>
            </PopoverTrigger>
            <PopoverContent
              _focusVisible={{
                boxShadow: 'none',
                outline: 'none'
              }}
              bg={'gray.700'}
              border={'none'}
              p={4}
              w={'185px'}
            >
              <PopoverBody
                color={'whiteAlpha.500'}
                p={0}
              >
                <Language />
                <FooterContent />
              </PopoverBody>
            </PopoverContent>
          </Popover>

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
                    path ===
                    `${locale !== 'en' ? '/' + locale : ''}${item.path}`
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
        </Center>
      </Show>
    </>
  );
};
export default Footer;
