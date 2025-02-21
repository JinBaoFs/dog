import {
  BoxProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Tooltip,
  useBoolean,
  useClipboard,
  Show,
  Hide
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import IconSvg from '../IconSvg';

export const Copy = ({ text, ...boxProps }: { text: string } & BoxProps) => {
  const [status, setStatus] = useBoolean();
  const { onCopy } = useClipboard(text);
  const t = useTranslations('Common');

  const handleCopy = useCallback(() => {
    setStatus.on();
    onCopy();
    setTimeout(setStatus.off, 2000);
  }, [onCopy, setStatus]);

  return (
    <>
      <Hide above="lg">
        <Popover placement="top">
          <PopoverTrigger>
            <IconSvg
              _hover={{
                opacity: 0.9
              }}
              boxSize={4}
              cursor={'pointer'}
              name="copy"
              {...boxProps}
              onClick={handleCopy}
            />
          </PopoverTrigger>
          <PopoverContent
            _focusVisible={{ outline: 'none' }}
            bg={'#EDF2F7'}
            border={'none'}
            w={'fit-content'}
          >
            <PopoverArrow bg={'#EDF2F7'} />
            <PopoverBody
              color={'black'}
              fontSize={'xs'}
              fontWeight={'bold'}
              textAlign={'left'}
            >
              {t('Copied')}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Hide>
      <Show above="lg">
        <Tooltip
          closeDelay={1000}
          closeOnClick={false}
          closeOnMouseDown={false}
          label={status ? 'Copied!' : 'Copy to clipboard'}
          onOpen={() => setStatus.off()}
        >
          <IconSvg
            _hover={{
              opacity: 0.9
            }}
            boxSize={4}
            cursor={'pointer'}
            name="copy"
            {...boxProps}
            onClick={handleCopy}
          />
        </Tooltip>
      </Show>
    </>
  );
};
