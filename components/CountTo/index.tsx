import { useMotionValue, motion, animate, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { BoxProps } from '@chakra-ui/react';
import ChakraMotionBox from '../ChakraMotionBox';

const CountTo = ({
  to,
  precision,
  ...rest
}: { to?: number; precision?: number } & BoxProps) => {
  const count = useMotionValue(0);
  const round = useTransform(count, value => value.toFixed(precision || 0));
  useEffect(() => {
    const animation = animate(count, to || 0, {
      duration: 1,
      ease: 'easeInOut'
    });
    return animation.stop;
  }, [count, to]);

  return (
    <ChakraMotionBox
      as={motion.span}
      {...rest}
    >
      {round}
    </ChakraMotionBox>
  );
};

export default CountTo;
