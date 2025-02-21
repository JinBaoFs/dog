import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  table: {
    // fontVariantNumeric: 'lining-nums tabular-nums',
    // borderCollapse: 'collapse',
    // width: 'full'
  },
  th: {},
  thead: {
    tr: {
      th: {
        color: 'whiteAlpha.600',
        fontWeight: '400',
        fontSize: '14px',
        borderBottomColor: 'whiteAlpha.100'
      }
    }
  },
  tbody: {
    tr: {
      td: {
        fontSize: '14px',
        textAlign: 'start',
        borderBottomColor: 'whiteAlpha.100'
      }
    }
  }
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
