import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function NotFound({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  redirect('/');
  return (
    <div>
      <h2>Page not found {t('Locale Configuration')}</h2>
      <p>Are you lost?{locale}</p>
    </div>
  );
}
