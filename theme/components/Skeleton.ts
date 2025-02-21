import { Skeleton as SkeletonComponent } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { keyframes } from '@chakra-ui/system';

const shine = () =>
  keyframes({
    to: { backgroundPositionX: '-200%' }
  });

const baseStyle = defineStyle(() => {
  return {
    opacity: 1,
    borderRadius: 'md',
    borderColor: 'rgba(16, 17, 18, 0.04)',
    background: 'linear-gradient(90deg, #e3e3e3 8%, #d1d1d1 18%, #e3e3e3 33%)',
    backgroundSize: '200% 100%'
  };
});

const Skeleton = defineStyleConfig({
  baseStyle
});

export default Skeleton;

SkeletonComponent.defaultProps = {
  ...SkeletonComponent.defaultProps,
  speed: 1,
  animation: `1s linear infinite ${shine()}`
};
