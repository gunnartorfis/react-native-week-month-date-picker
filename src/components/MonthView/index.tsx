import { addMonths, differenceInMonths, getDay, isSameDay } from 'date-fns';
import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  ScrollView,
  ScrollViewProps,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import type { MarkedDates } from 'react-native-week-month-date-picker';
import { generateDateRangeSplitByMonth } from '../../utils/generateDateRange';
import DatePickerItem, { DatePickerItemProps } from '../DatePickerItem';
import { ITEM_WIDTH } from '../DatePickerItem/styles';
import { doesDateHaveSlots } from '../WeekView';
import styles, { lightStyles, darkStyles } from './styles';

const MAX_MONTHS_TO_SHOW = 4;

const MonthViewRaw: React.FC<
  {
    startDate: Date;
    endDate: Date;
    selectedDate: Date;
    onPressDate: DatePickerItemProps['onPressDate'];
    setScrollToTopTrigger: (trigger: () => void) => void;
    markedDates?: MarkedDates;
  } & ScrollViewProps
> = ({
  startDate,
  endDate,
  onPressDate,
  setScrollToTopTrigger,
  style,
  selectedDate,
  markedDates,
  ...props
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const theme = useColorScheme();

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

  const colorStyles = theme === 'light' ? lightStyles : darkStyles;

  return (
    <Animated.View style={style}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContentContainer}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            if (!hasLoadedAll) {
              setDatesToDisplay(allDatesToDisplay);
            }
          }
        }}
        scrollEventThrottle={400}
        {...props}
      >
        {datesToDisplay.map((datesInMonth) => {
          const monthNameLowercase = moment(datesInMonth[0].date).format('MMM');
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

          const MONTH_VIEW_ITEM_WIDTH = Math.floor(ITEM_WIDTH);

          return (
            <View
              key={moment(datesInMonth[0].date).toString()}
              style={styles.monthContainer}
            >
              <Text style={{ marginLeft: initialLeftMargin + 12 }}>
                {monthName}
              </Text>
              <View style={styles.monthDaysContainer}>
                {datesInMonth.map((date, index) => {
                  return (
                    <DatePickerItem
                      key={date.date.toString()}
                      date={date.date}
                      hasSlots={doesDateHaveSlots(date.date, markedDates)}
                      isSelected={isSameDay(date.date, selectedDate)}
                      onPressDate={onPressDate}
                      style={[
                        styles.datePickerItem,
                        colorStyles.datePickerItem,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                          marginLeft: index === 0 ? initialLeftMargin : 0,
                        },
                      ]}
                      itemWidth={MONTH_VIEW_ITEM_WIDTH}
                      isDisabled={date.isDisabled}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
        {!hasLoadedAll ? (
          <ActivityIndicator style={styles.loadMoreIndicator} />
        ) : null}
      </ScrollView>
    </Animated.View>
  );
};

export default MonthViewRaw;
