import type { HTMLChakraProps } from '@chakra-ui/react';
import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';
import { type IconName } from 'public/icons/name';

export const href = '/icons/sprite.svg?v1.0.0';

export { IconName };

interface Props extends HTMLChakraProps<'div'> {
  name: IconName;
  isLoading?: boolean;
}

const IconSvg = (
  { name, isLoading, ...props }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <Skeleton
      display="inline-block"
      isLoaded={!isLoading}
      {...props}
      ref={ref}
    >
      <chakra.svg
        h="100%"
        w="100%"
      >
        <use href={`${href}#${name}`} />
      </chakra.svg>
    </Skeleton>
  );
};

export default React.forwardRef(IconSvg);
