import { VStack, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useChangeLng } from '@/i18n/navigation';
import IconSvg from '../IconSvg';

const Language = () => {
  const path = usePathname();
  const { changeLng } = useChangeLng();

  const langConfig = useMemo(() => {
    return [
      {
        name: '繁体中文',
        path: 'zh-Hant'
      },
      {
        name: 'English',
        path: 'en'
      },
      {
        name: '日本语',
        path: 'ja'
      },
      {
        name: '한국어',
        path: 'ko'
      }
    ];
  }, []);

  const currentLang = useMemo(() => {
    const arr = path.slice(1).split('/');
    const data = langConfig.find(item => item.path === arr[0]);
    return data || langConfig[0];
  }, [langConfig, path]);

  return (
    <VStack
      gap={3}
      p={4}
    >
      {langConfig.map((item, index) => {
        return (
          <Flex
            _hover={{
              bg: 'black.300'
            }}
            alignItems={'center'}
            borderRadius={'lg'}
            color={item.path === currentLang.path ? 'white' : 'whiteAlpha.300'}
            cursor={'pointer'}
            fontSize={'sm'}
            justify={'space-between'}
            key={index}
            lineHeight={'24px'}
            onClick={() => changeLng(item.path)}
            transitionDuration={'normal'}
            w={'full'}
          >
            {item.name}
            {currentLang.name === item.name && (
              <IconSvg
                boxSize={3}
                name="check"
              />
            )}
          </Flex>
        );
      })}
    </VStack>
  );
};

export default Language;
