import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';

export default function useLenis() {
  useEffect(() => {
    const lens = new Lenis();
    const raf = (time: number) => {
      lens?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);
}
