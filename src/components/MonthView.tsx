import { getDay, isSameDay, differenceInMonths, addMonths } from 'date-fns';
import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  ScrollView,
  ScrollViewProps,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import type { TimeSlots } from 'src/types/timeslots';
import { generateDateRangeSplitByMonth } from 'src/utils/generateDateRange';
import DatePickerItem, {
  DatePickerItemProps,
  ITEM_WIDTH,
} from './DatePickerItem';
import { doesDateHaveSlots } from './WeekView';

const MAX_MONTHS_TO_SHOW = 4;

const MonthViewRaw: React.FC<
  {
    startDate: Date;
    endDate: Date;
    selectedDate: Date;
    onPressDate: DatePickerItemProps['onPressDate'];
    setScrollToTopTrigger: (trigger: () => void) => void;
    timeslots?: TimeSlots;
  } & ScrollViewProps
> = ({
  startDate,
  endDate,
  onPressDate,
  setScrollToTopTrigger,
  style,
  selectedDate,
  timeslots,
  ...props
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  const endDateIsMoreThanMaxMonthsAway =
    differenceInMonths(endDate, startDate) > MAX_MONTHS_TO_SHOW;
  const initialEndDate = endDateIsMoreThanMaxMonthsAway
    ? addMonths(startDate, MAX_MONTHS_TO_SHOW)
    : endDate;

  const [datesToDisplay, setDatesToDisplay] = React.useState(
    generateDateRangeSplitByMonth(startDate, initialEndDate)
  );

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = Dimensions.get('window').height / 3;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  React.useEffect(() => {
    setScrollToTopTrigger(scrollToTop);
  }, [setScrollToTopTrigger]);

  const allDatesToDisplay = React.useMemo(() => {
    return generateDateRangeSplitByMonth(startDate, endDate);
  }, [startDate, endDate]);

  const hasLoadedAll = datesToDisplay.length === allDatesToDisplay.length;

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          // paddingTop: 8,
        },
        style,
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingBottom: 8,
          paddingTop: 8,
        }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            if (!hasLoadedAll) {
              console.log('Updating....');
              setDatesToDisplay(allDatesToDisplay);
            }
          }
        }}
        scrollEventThrottle={400}
        {...props}
      >
        {datesToDisplay.map((datesInMonth) => {
          const monthNameLowercase = moment(datesInMonth[0].date).format('MMM');
          // const isCurrentMonth = moment(datesInMonth[0].date).isSame(
          //   moment(),
          //   'month'
          // );
          const monthName =
            monthNameLowercase.charAt(0).toUpperCase() +
            monthNameLowercase.slice(1);
          const firstDayOfMonthAsWeekDay = getDay(datesInMonth[0].date); // 0 Sunday, 1 Monday, ... 6 Saturday
          let initialLeftMargin = Math.floor(
            (Dimensions.get('window').width / 7) *
              (firstDayOfMonthAsWeekDay - 1)
          );

          if (firstDayOfMonthAsWeekDay === 0) {
            // If the first day of the month is Sunday, we must treat it as "7"..
            initialLeftMargin = Math.floor(
              (Dimensions.get('window').width / 7) * 6
            );
          }

          const HORIZONTAL_PADDING = 0;
          const MONTH_VIEW_ITEM_WIDTH = Math.floor(ITEM_WIDTH);

          return (
            <View
              key={moment(datesInMonth[0].date).toString()}
              style={{
                paddingHorizontal: HORIZONTAL_PADDING,
                marginTop: 8,
              }}
            >
              <Text style={{ marginLeft: initialLeftMargin + 12 }}>
                {monthName}
              </Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}
              >
                {datesInMonth.map((date, index) => {
                  return (
                    <DatePickerItem
                      key={date.date.toString()}
                      date={date.date}
                      hasSlots={doesDateHaveSlots(date.date, timeslots)}
                      isSelected={isSameDay(date.date, selectedDate)}
                      onPressDate={onPressDate}
                      style={{
                        marginLeft: index === 0 ? initialLeftMargin : 0,
                        borderTopWidth: 1,
                        borderTopColor: '#ccc',
                        paddingTop: 8,
                        paddingBottom: 12,
                      }}
                      showDayChar={false}
                      itemWidth={MONTH_VIEW_ITEM_WIDTH}
                      isDisabled={date.isDisabled}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
        {!hasLoadedAll ? <ActivityIndicator style={{ marginTop: 12 }} /> : null}
      </ScrollView>
    </Animated.View>
  );
};

export default MonthViewRaw;
