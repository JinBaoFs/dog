import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const xxl = defineStyle({
  height: '90px',
  width: '90px'
});
export const spinnerTheme = defineStyleConfig({
  sizes: { xxl }
});
