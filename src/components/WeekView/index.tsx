import { getDay, isSameDay, isToday } from 'date-fns';
import React from 'react';
import { FlatList, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Dates, MarkedDates } from 'react-native-week-month-date-picker';
import DatePickerItem, { DatePickerItemProps } from '../DatePickerItem';
import { ITEM_WIDTH_WITHOUT_MARGINS } from '../DatePickerItem/styles';
import styles from './styles';

export const doesDateHaveSlots = (date: Date, markedDates?: MarkedDates) => {
  const slots = markedDates?.find((t) => {
    return isSameDay(date, t);
  });
  return !!slots;
};

const WeekView: React.FC<
  {
    onPressDate: DatePickerItemProps['onPressDate'];
    dates: Dates;
    markedDates?: MarkedDates;
    setScrollDatePickerToDateTrigger: (trigger: (date: Date) => void) => void;
    selectedDate: Date;
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

  React.useEffect(() => {
    const scrollDatePickerToDate = (date: Date) => {
      const indexOfSelectedDate = dates.findIndex((d) =>
        isSameDay(date, d.date)
      );
      let indexToScrollTo = indexOfSelectedDate;
      const indexOfFirstDateInWeek = indexOfSelectedDate - getDay(date) + 1; // 1 because starting at Mondays

      if (isToday(date)) {
        indexToScrollTo = 0;
      } else if (indexOfFirstDateInWeek <= 6) {
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
    };

    setScrollDatePickerToDateTrigger(scrollDatePickerToDate);
  }, [setScrollDatePickerToDateTrigger, dates]);

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
