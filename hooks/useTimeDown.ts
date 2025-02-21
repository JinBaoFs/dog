import { useTranslations } from 'next-intl';
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  MutableRefObject
} from 'react';

export const useTimeDown = (
  targetTime?: string
): {
  date?: string;
  isFinished: boolean;
} => {
  const t = useTranslations();
  const timer: MutableRefObject<any> = useRef();
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetTime as string) - +new Date();
    let timeLeft = {
      isFinished: false,
      date: ''
    };

    if (difference > 0) {
      const { days, hours, minutes, seconds } = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
      timeLeft = {
        date: `${days * 24 + hours}${t('H')}${minutes}${t('M')}${seconds}${t(
          'S'
        )}`,
        isFinished: false
      };
    } else {
      clearInterval(timer.current);
      timeLeft = {
        date: '',
        isFinished: true
      };
    }
    return timeLeft;
  }, [targetTime, t]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!targetTime) return;
    setTimeLeft(calculateTimeLeft());
    timer.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer.current);
  }, [targetTime, timer, calculateTimeLeft]);

  return timeLeft;
};
