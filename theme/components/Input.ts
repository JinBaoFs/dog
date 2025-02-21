import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

const baseStyle = defineStyle({
  field: {
    border: 'none',
    borderWidth: 0,
    px: '0',
    fontSize: '14px',
    outline: 0,
    appearance: 'none',
    _placeholder: {
      color: '#989898'
    },
    _hover: {
      borderColor: 'transparent'
    },
    _focusVisible: {
      outline: 'none'
    }
  }
});

export default defineMultiStyleConfig({ baseStyle });
