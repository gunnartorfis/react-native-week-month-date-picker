import {
  addDays,
  endOfDay,
  isPast,
  isToday,
  addMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

export const generateDateRange = (startDate: Date, endDate: Date) => {
  const dates = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push({
      date: currentDate,
      isSelected: isToday(currentDate),
      isDisabled: isPast(endOfDay(currentDate)),
    });
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

export const generateDateRangeSplitByMonth = (
  startDate: Date,
  endDate: Date
) => {
  const months = [];

  while (startDate <= endDate) {
    months.push(
      generateDateRange(startOfMonth(startDate), endOfMonth(startDate))
    );
    startDate = addMonths(startDate, 1);
  }

  return months;
};
