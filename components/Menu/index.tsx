'use client';
import { AnimatePresence, useCycle } from 'framer-motion';
import { Box, useConst } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ChakraMotionBox from '../ChakraMotionBox';
import { MenuToggle } from './MenuToggle';

const MneuItem = () => {
  const variants = useConst({
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: {
          stiffness: 100,
          velocity: -100
        }
      }
    },
    closed: {
      y: 100,
      opacity: 0,
      transition: {
        y: {
          stiffness: 100
        }
      }
    }
  });
  return (
    <ChakraMotionBox
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        border={'1px solid #FF008C'}
        borderRadius={'5px'}
        height={'50px'}
        marginBottom={'20px'}
        w={'200px'}
      ></Box>
    </ChakraMotionBox>
  );
};

const MenuContainer = () => {
  const variants = useConst({
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
        x: {
          duration: 0
        }
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  });

  return (
    <AnimatePresence mode="sync">
      <ChakraMotionBox
        variants={variants}
        w={200}
      >
        {[1, 2, 3, 4, 5].map(item => (
          <MneuItem key={item} />
        ))}
      </ChakraMotionBox>
    </AnimatePresence>
  );
};

const Menu = () => {
  const [isOpen, toggle] = useCycle(false, true);
  const [body, setBody] = useState<HTMLElement>();
  // const body = useConst(document.body);
  useEffect(() => {
    setBody(document.body);
    body && (body.style.overflowY = isOpen ? 'hidden' : 'auto');
  }, [isOpen, body]);

  const sidebar = useConst({
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 260px 40px)`,
      transition: {
        type: 'spring',
        stiffness: 20,
        restDelta: 2
      }
    }),
    closed: {
      clipPath: 'circle(25px at 258px 40px)',
      z: 200,
      transition: {
        delay: 0.3,
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  });

  return (
    <ChakraMotionBox
      animate={isOpen ? 'open' : 'closed'}
      initial={false}
    >
      <ChakraMotionBox
        bg={'black.300'}
        bottom={0}
        pos={'absolute'}
        right={0}
        top={0}
        variants={sidebar}
        w={'300px'}
      />
      <Box
        pos={'absolute'}
        right={0}
        top={0}
      >
        <MenuToggle toggle={() => toggle()} />
        <Box
          margin={'0 50px'}
          marginTop={100}
          pos={'relative'}
        >
          <MenuContainer></MenuContainer>
        </Box>
      </Box>
    </ChakraMotionBox>
  );
};
export default Menu;
