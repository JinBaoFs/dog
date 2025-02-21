import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  tab: {
    paddingInlineStart: '0',
    paddingInlineEnd: '0',
    fontSize: '14px !important',
    _selected: {
      color: 'blue.600',
      fontSize: '16px',
      paddingInlineStart: '0',
      paddingInlineEnd: '0'
    }
  },
  tabpanel: {
    px: 0
  }
});

export default defineMultiStyleConfig({ baseStyle });
