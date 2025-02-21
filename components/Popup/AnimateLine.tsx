'use client';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';
import { Hash } from 'viem';
import { useRemovePopup } from '@/state/application/hooks';
import ChakraMotionBox from '../ChakraMotionBox';

export const AnimateLine = ({
  removeAfterMs = 15,
  popKey
}: {
  removeAfterMs: number | null;
  popKey: Hash;
}) => {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(() => {
    removePopup({ key: popKey });
  }, [removePopup, popKey]);
  useEffect(() => {
    if (removeAfterMs === null) return undefined;
    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs);
    return () => {
      clearTimeout(timeout);
    };
  }, [removeThisPopup, removeAfterMs]);
  return (
    <ChakraMotionBox
      animate={{ width: '0' }}
      as={motion.div}
      bg={'black.700'}
      bottom={'0'}
      height={'2px'}
      initial={{ width: '125%' }}
      left={0}
      position={'absolute'}
      //@ts-ignore
      transition={{ duration: removeAfterMs ? removeAfterMs / 1000 : 15 }}
    ></ChakraMotionBox>
  );
};
