import { useTheme, Theme } from '@chakra-ui/react';
import {
  defineStyle,
  defineStyleConfig,
  StyleFunctionProps
} from '@chakra-ui/styled-system';

// import { mode } from '@chakra-ui/theme-tools';

const baseStyle = defineStyle((props: StyleFunctionProps) => {
  const { colorScheme: c } = props;
  const theme = useTheme<Theme>();
  return {
    cursor: 'pointer',
    lineHeight: 1,
    borderRadius: 'full',
    width: 'full',
    color: `${c}.200`,
    _disabled: {
      opacity: 1,
      backgroundColor: theme.colors.black['200'],
      color: 'black'
    },
    _hover: {
      bg: theme.colors.black['200'],
      _disabled: {
        backgroundColor: theme.colors.black['200']
      }
    }
  };
});

const sizes = {
  md: defineStyle((props: StyleFunctionProps) => {
    const { colorScheme: c } = props;
    return {
      height: '40px',
      fontSize: 'md',
      borderRadius: 'full',
      border: `1px solid ${c}.200`
    };
  })
};

const solid = defineStyle((props: StyleFunctionProps) => {
  const { colorScheme: c } = props;
  return {
    color: 'black',
    bg: `${c}.200`,
    _disabled: {
      bg: 'whiteAlpha.400'
    },
    _hover: {
      _disabled: {
        bg: 'whiteAlpha.400'
      }
    }
  };
});

const outline = defineStyle((props: StyleFunctionProps) => {
  const { colorScheme: c } = props;
  return {
    color: `${c}.200`,
    _disabled: {
      borderColor: 'whiteAlpha.400',
      color: 'whiteAlpha.400'
    },
    _hover: {
      borderColor: `${c}.500`,
      bg: 'transparent',
      color: `${c}.500`,
      _disabled: {
        borderColor: 'whiteAlpha.400',
        color: 'whiteAlpha.400'
      }
    },
    _active: {
      bg: 'transparent',
      borderColor: `${c}.500`,
      color: `${c}.500`
    }
  };
});

// const customVariant = defineStyle(() => {
//   return {
//     bg: 'linear-gradient( 270deg, #82ECFF 0%, #1E9DFF 100%);',
//     color: 'black.500',
//     fontSize: '20px',
//     _loading: {
//       _hover: {
//         bg: 'linear-gradient( 270deg, #82ECFF 0%, #1E9DFF 100%);'
//       },
//       bg: 'linear-gradient( 270deg, #82ECFF 0%, #1E9DFF 100%);'
//     },
//     _disabled: {
//       _hover: {
//         bg: 'linear-gradient( 270deg, #82ECFF 0%, #1E9DFF 100%) !important; '
//       },
//       bg: 'linear-gradient( 270deg, #82ECFF 0%, #1E9DFF 100%);'
//     }
//   };
// });

export default defineStyleConfig({
  baseStyle,
  sizes,
  variants: {
    solid,
    outline
  },
  defaultProps: {
    colorScheme: 'purple' // set the default color scheme to purple
  }
});
