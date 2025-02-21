'use client';
import { Box, BoxProps } from '@chakra-ui/react';
import { RefObject } from 'react';

interface svgatorPorps extends BoxProps {
  iconName: string;
  svgRef: RefObject<HTMLObjectElement>;
}

const Svgator = ({ iconName, svgRef, ...rest }: svgatorPorps) => {
  return (
    <Box {...rest}>
      <object
        data={`/assets/svg/${iconName}.svg`}
        id="an-svg"
        ref={svgRef}
        type="image/svg+xml"
      ></object>
    </Box>
  );
};

export default Svgator;
