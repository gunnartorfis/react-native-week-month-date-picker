import { format, getDay, isSameDay, isToday } from 'date-fns';
import React from 'react';
import { FlatList, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Dates } from 'react-native-week-month-date-picker';
import type { TimeSlots } from 'src/types/timeslots';
import DatePickerItem, {
  DatePickerItemProps,
  ITEM_WIDTH_WITHOUT_MARGINS,
} from './DatePickerItem';

export const doesDateHaveSlots = (date: Date, timeslots?: TimeSlots) => {
  const slots = timeslots?.find((t) => {
    return t.date === format(date, 'yyyy-MM-dd');
  })?.slots;
  return (slots?.length || 0) > 0;
};

const WeekViewRaw: React.FC<
  {
    onPressDate: DatePickerItemProps['onPressDate'];
    dates: Dates;
    timeslots?: TimeSlots;
    setScrollDatePickerToDateTrigger: (trigger: (date: Date) => void) => void;
  } & ViewProps
> = ({
  style,
  onPressDate,
  dates,
  timeslots,
  setScrollDatePickerToDateTrigger,
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
        style={{ flexGrow: 1, flexShrink: 0 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
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
              hasSlots={doesDateHaveSlots(item.date, timeslots)}
              showDayChar={false}
            />
          );
        }}
      />
    </Animated.View>
  );
};

export default WeekViewRaw;
