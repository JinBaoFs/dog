import { useCallback, useRef, useState } from 'react';
import ChakraMotionBox from '../ChakraMotionBox';

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current
        ? ref.current.getBoundingClientRect()
        : { height: 0, width: 0, left: 0, top: 0 };
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPos({ x: middleX, y: middleY });
    },
    [setPos, ref]
  );

  const reset = useCallback(() => {
    setPos({ x: 0, y: 0 });
  }, [setPos]);

  return (
    <ChakraMotionBox
      animate={pos}
      onMouseLeave={reset}
      onMouseMove={onMouseMove}
      pos={'relative'}
      ref={ref}
      transition={{ type: 'spring', bounce: '1', damping: '5', mass: '0.5' }}
    >
      {children}
    </ChakraMotionBox>
  );
};

export default Magnetic;
