import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { useSearchParams } from 'next/navigation';
import { locales } from './i18nConfig';

export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });

export const useChangeLng = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  const changeLng = (locale: string) => {
    router.replace(`${pathname}${searchParams ? '?' + searchParams : ''}`, {
      locale
    });
  };

  return {
    changeLng,
    pathname
  };
};
