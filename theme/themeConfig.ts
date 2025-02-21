'use client';

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
// import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import {
  LightFont,
  RegularFont,
  MediumFont,
  SemiBoldFont,
  BoldFont
} from '@/public/fonts';
import Button from './components/Button';
import Menu from './components/Menu';
import Input from './components/Input';
import { tableTheme } from './components/Table';
import Tabs from './components/Tabs';
import Skeleton from './components/Skeleton';
import { spinnerTheme } from './components/Spinner';

const config: ThemeConfig = {
  cssVarPrefix: 'dialect',
  // initialColorMode: 'dark',
  useSystemColorMode: false
};

const colors = {
  gray: {
    900: '#1B1B1B'
  },
  blue: {
    100: '#EDF1F4'
  },
  green: {
    500: '#22C55E'
  },
  red: {},
  yellow: {
    50: '#FFF7EA',
    100: '#FFDA9C',
    200: '#FFB438',
    300: '#FF9F00',
    400: '#C88210',
    500: '#AD6C00',
    600: '#7C4D00'
  },
  pink: {}
};

const theme = extendTheme({
  styles: {
    global: () => {
      return {
        body: {
          fontFamily: 500,
          // bg: theme.colors.black['600'],
          color: 'white',
          lineHeight: 'shorts'
        }
      };
    }
  },
  sizes: {
    xs: '22rem'
  },
  config,
  colors,
  radii: {
    '0.625xl': '0.625rem',
    '2.5xl': '1.25rem',
    '4xl': '2rem'
  },
  shadows: {
    md: '0 20px 20px #ff0000'
  },
  lineHeights: {
    shorts: 1.4
  },
  space: {},
  components: {
    Button,
    Menu,
    Table: tableTheme,
    Input,
    Tabs,
    Skeleton,
    Spinner: spinnerTheme
  },
  breakpoints: {
    base: '0em',
    md: '887px'
  },
  fontSizes: {
    '4xl': '2rem'
  },
  fonts: {
    300: LightFont.style.fontFamily,
    400: RegularFont.style.fontFamily,
    500: MediumFont.style.fontFamily,
    600: SemiBoldFont.style.fontFamily,
    700: BoldFont.style.fontFamily
  }
});

export default theme;
