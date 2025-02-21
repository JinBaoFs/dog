import {
  Popover as CPopover,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger
} from '@chakra-ui/react';
import IconSvg from '../IconSvg';

const Tooltip = ({ label }: { label?: string; children?: React.ReactNode }) => {
  return (
    <CPopover placement="top">
      <PopoverTrigger>
        <IconSvg
          boxSize={4}
          color={'blackAlpha.700'}
          name="info"
        />
      </PopoverTrigger>
      <PopoverContent
        _focusVisible={{ outline: 'none' }}
        bg={'blackAlpha.900'}
        border={'none'}
        w={'180px'}
      >
        <PopoverArrow
          bg={'blackAlpha.900'}
          boxShadow={'none'}
        />
        <PopoverBody
          color={'white'}
          fontSize={'xs'}
          fontWeight={'bold'}
          textAlign={'left'}
        >
          {label}
        </PopoverBody>
      </PopoverContent>
    </CPopover>
  );
};

export default Tooltip;
