'use client';
import { Box } from '@chakra-ui/react';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { AnimationPlaybackControls, animate } from 'framer-motion';
import ChakraMotionBox from '../ChakraMotionBox';

interface MarqueeProsp {
  children: ReactNode[];
  speed: number;
  isPauseOnhover: boolean;
  direction: 'left' | 'right';
  loop?: number;
  gap: number;
  itemSize: number;
  bgColorStart?: string;
  bgColorEnd?: string;
  shadowWidth?: string;
}

type BoxShowProps = Pick<
  MarqueeProsp,
  'bgColorEnd' | 'bgColorStart' | 'shadowWidth'
> & { isLeft: boolean };

const BoxShow = ({
  isLeft,
  shadowWidth = '50px',
  bgColorStart,
  bgColorEnd
}: BoxShowProps) => (
  <Box
    bg={`linear-gradient(${
      isLeft ? 'to right' : 'to left'
    }, ${bgColorStart} 0%, ${bgColorEnd} 100%)`}
    height={'100%'}
    pos={'absolute'}
    top={0}
    w={shadowWidth}
    zIndex={1}
    {...{ [isLeft ? 'left' : 'right']: '0' }}
  ></Box>
);

const Marquee = ({
  children,
  direction,
  bgColorStart = 'rgba(255, 255, 255, 1)',
  bgColorEnd = 'rgba(255, 255, 255, 0)',
  shadowWidth,
  isPauseOnhover,
  gap,
  itemSize,
  loop,
  speed
}: MarqueeProsp) => {
  const containerRef = useRef(null);

  const [animation, setAnimation] = useState<AnimationPlaybackControls>();

  const isToLeft = useMemo(() => direction === 'left', [direction]);

  useEffect(() => {
    setAnimation(
      animate(
        containerRef.current,
        {
          x: (isToLeft ? -1 : 1) * (itemSize + gap) * children.length
        },
        {
          duration: speed,
          repeat: loop || Infinity,
          ease: 'linear'
        }
      )
    );
  }, [
    containerRef,
    children,
    setAnimation,
    isToLeft,
    gap,
    itemSize,
    loop,
    speed
  ]);

  const marqieeChildren = useMemo(() => {
    return children;
  }, [children]);

  const onHoverStart = useCallback(() => {
    isPauseOnhover && animation?.pause();
  }, [isPauseOnhover, animation]);

  return (
    <Box
      overflowX={'hidden'}
      pos={'relative'}
      w={'100%'}
    >
      <BoxShow
        bgColorEnd={bgColorEnd}
        bgColorStart={bgColorStart}
        isLeft
        shadowWidth={shadowWidth}
      />
      <BoxShow
        bgColorEnd={bgColorEnd}
        bgColorStart={bgColorStart}
        isLeft={false}
        shadowWidth={shadowWidth}
      />
      <ChakraMotionBox
        display={'flex'}
        gap={gap}
        justifyContent={isToLeft ? '' : 'flex-end'}
        onHoverEnd={() => animation?.play()}
        onHoverStart={onHoverStart}
        ref={containerRef}
        w={'fit-content'}
      >
        {[...marqieeChildren, ...marqieeChildren].map((item, index) => (
          <Box key={index}>{item}</Box>
        ))}
      </ChakraMotionBox>
    </Box>
  );
};

export default Marquee;
