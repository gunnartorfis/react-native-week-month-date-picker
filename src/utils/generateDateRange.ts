import {
  addDays,
  endOfDay,
  isPast,
  isToday,
  addMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import type { DatePickerProps } from '../';

type GenerateDateRangeParams = {
  startDate: Date;
  endDate: Date;
  disabledDates?: DatePickerProps['disabledDates'];
  allowsPastDates?: boolean;
};

export const generateDateRange = ({
  startDate,
  endDate,
  allowsPastDates = true,
  disabledDates,
}: GenerateDateRangeParams) => {
  const dates = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push({
      date: currentDate,
      isSelected: isToday(currentDate),
      isDisabled:
        allowsPastDates === true
          ? disabledDates?.includes(currentDate) ?? false
          : isPast(endOfDay(currentDate)) ?? false,
    });
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

export const generateDateRangeSplitByMonth = ({
  startDate,
  endDate,
  allowsPastDates,
  disabledDates,
}: GenerateDateRangeParams) => {
  const months = [];

  while (startDate <= endDate) {
    months.push(
      generateDateRange({
        startDate: startOfMonth(startDate),
        endDate: endOfMonth(startDate),
        allowsPastDates,
        disabledDates,
      })
    );
    startDate = addMonths(startDate, 1);
  }

  return months;
};
