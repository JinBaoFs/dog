import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

type Lang = 'en' | 'zh';

const useCurrentLang = (): Lang => {
  const path = usePathname();
  const langConfig = useMemo(() => ['en', 'zh'], []);

  const currentLang = useMemo<Lang>(() => {
    const arr = path.slice(1).split('/');
    const data = langConfig.find(item => item === arr[0]);
    return (data || 'en') as Lang;
  }, [langConfig, path]);

  return currentLang;
};

export default useCurrentLang;
