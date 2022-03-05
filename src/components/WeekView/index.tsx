import { getDay, isSameDay } from 'date-fns';
import React from 'react';
import { FlatList, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Dates } from 'react-native-week-month-date-picker';
import type { DatePickerProps } from '../..';
import DatePickerItem, { DatePickerItemProps } from '../DatePickerItem';
import { ITEM_WIDTH_WITHOUT_MARGINS } from '../DatePickerItem/styles';
import styles from './styles';

export const doesDateHaveSlots = (
  date: Date,
  markedDates?: DatePickerProps['markedDates']
) => {
  const slots = markedDates?.find((t) => {
    return isSameDay(date, t);
  });
  return !!slots;
};

const WeekView: React.FC<
  {
    onPressDate: DatePickerItemProps['onPressDate'];
    dates: Dates;
    markedDates: DatePickerProps['markedDates'];
    setScrollDatePickerToDateTrigger: (trigger: (date: Date) => void) => void;
    selectedDate: DatePickerProps['selectedDate'];
  } & ViewProps
> = ({
  style,
  onPressDate,
  dates,
  markedDates,
  setScrollDatePickerToDateTrigger,
  selectedDate,
}) => {
  const flatListRef = React.useRef<FlatList>(null);
  const hasScrolledInitially = React.useRef(false);

  const scrollDatePickerToDate = React.useCallback(
    (date: Date) => {
      const indexOfSelectedDate = dates.findIndex((d) =>
        isSameDay(date, d.date)
      );
      let indexToScrollTo = indexOfSelectedDate;
      const indexOfFirstDateInWeek = indexOfSelectedDate - getDay(date) + 1; // 1 because starting at Mondays

      if (indexOfFirstDateInWeek <= 6) {
        // User is scrolling Today when in current week
        indexToScrollTo = 0;
      } else {
        indexToScrollTo = indexOfFirstDateInWeek;
      }

      if (indexToScrollTo >= 0) {
        flatListRef.current?.scrollToIndex({
          index: indexToScrollTo,
          animated: true,
        });
      }
    },
    [dates]
  );

  React.useEffect(() => {
    if (selectedDate && hasScrolledInitially.current === false) {
      hasScrolledInitially.current = true;
      scrollDatePickerToDate(selectedDate);
    }
  }, [scrollDatePickerToDate, selectedDate]);

  React.useEffect(() => {
    setScrollDatePickerToDateTrigger(scrollDatePickerToDate);
  }, [setScrollDatePickerToDateTrigger, dates, scrollDatePickerToDate]);

  return (
    <Animated.View style={style}>
      <FlatList
        data={dates}
        ref={flatListRef}
        contentContainerStyle={styles.flatListContentContainer}
        keyExtractor={(item) => item.date.toString()}
        horizontal
        removeClippedSubviews
        initialNumToRender={7}
        pagingEnabled={true}
        getItemLayout={(_, index) => {
          return {
            length: ITEM_WIDTH_WITHOUT_MARGINS,
            offset: ITEM_WIDTH_WITHOUT_MARGINS * index,
            index,
          };
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <DatePickerItem
              {...item}
              key={item.date.toString()}
              onPressDate={onPressDate}
              hasSlots={doesDateHaveSlots(item.date, markedDates)}
              isSelected={isSameDay(item.date, selectedDate)}
            />
          );
        }}
      />
    </Animated.View>
  );
};

export default WeekView;
