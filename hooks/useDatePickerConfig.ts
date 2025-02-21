import { DatepickerConfigs } from 'chakra-dayzed-datepicker';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export const useDatePickerConfig = () => {
  const t = useTranslations();
  const config = useMemo<DatepickerConfigs>(() => {
    return {
      dateFormat: 'yyyy-MM-dd',
      monthNames: [
        t('common.month.January'),
        t('common.month.February'),
        t('common.month.March'),
        t('common.month.April'),
        t('common.month.May'),
        t('common.month.June'),
        t('common.month.July'),
        t('common.month.August'),
        t('common.month.September'),
        t('common.month.October'),
        t('common.month.November'),
        t('common.month.December')
      ],
      dayNames: [
        t('common.week.Mo'),
        t('common.week.Tu'),
        t('common.week.We'),
        t('common.week.Th'),
        t('common.week.Fr'),
        t('common.week.Sa'),
        t('common.week.Su')
      ]
    };
  }, [t]);
  return config;
};
