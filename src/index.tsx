import { addDays, isSameDay, isToday, startOfWeek } from 'date-fns';
import React from 'react';
import {
  Dimensions,
  Platform,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MonthView from './components/MonthView';
import TextButton from './components/TextButton';
import WeekViewRaw from './components/WeekView';
import type { TimeSlots } from './types/timeslots';
import { generateDateRange } from './utils/generateDateRange';

export type Dates = {
  date: Date;
  isSelected: boolean;
  isDisabled: boolean;
}[];

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('screen');
const WEEK_VIEW_HEIGHT = 140;
const NAVIGATION_TITLE_HEIGHT = 70;
const WEEK_MONTH_TOGGLER_WIDTH = 32;

export const DatePicker: React.FC<{
  startDate: Date;
  maxFutureDays: number;
  timeslots: TimeSlots;
}> = ({ startDate, maxFutureDays, timeslots }) => {
  const weekScrollDatePickerToDateTriggerRef =
    React.useRef<(date: Date) => void>();
  const monthScrollToTopTriggerRef = React.useRef<() => void>();

  const [dates, setDates] = React.useState<Dates>(
    generateDateRange(
      startOfWeek(new Date(), {
        weekStartsOn: 1, // Monday
      }),
      addDays(startDate, maxFutureDays || 30)
    )
  );
  const selectedDay = dates.find((date) => date.isSelected)?.date ?? new Date();
  const endDate = addDays(startDate, maxFutureDays || 30);

  const safeAreaInsets = useSafeAreaInsets();
  const MONTH_VIEW_HEIGHT =
    WINDOW_HEIGHT -
    safeAreaInsets.top -
    safeAreaInsets.bottom -
    NAVIGATION_TITLE_HEIGHT -
    (Platform.select({ ios: 0, android: 90 }) || 0);

  const weekMonthContainerHeight = useSharedValue(WEEK_VIEW_HEIGHT);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startHeight = weekMonthContainerHeight.value;
    },
    onActive: (event, ctx) => {
      weekMonthContainerHeight.value = ctx.startHeight - event.translationY;
    },
    onEnd: ({ translationY }) => {
      let snapPointY = weekMonthContainerHeight.value;
      if (translationY > 0) {
        if (translationY > 40) {
          snapPointY = WEEK_VIEW_HEIGHT;
        } else {
          snapPointY = MONTH_VIEW_HEIGHT;
        }
      } else if (translationY < 0) {
        if (translationY < -40) {
          snapPointY = MONTH_VIEW_HEIGHT;
        } else {
          snapPointY = WEEK_VIEW_HEIGHT;
        }
      }

      weekMonthContainerHeight.value = withTiming(snapPointY, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
    },
  });

  const gestureStyle = useAnimatedStyle(() => {
    const height = weekMonthContainerHeight.value;

    const weekViewConfig = {
      height,
      transform: [
        {
          translateY: 0,
        },
      ],
    };

    return weekViewConfig;
  });

  const showMonthView = () => {
    weekMonthContainerHeight.value = withTiming(MONTH_VIEW_HEIGHT, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  };

  const hideMonthView = () => {
    weekMonthContainerHeight.value = withTiming(WEEK_VIEW_HEIGHT, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  };

  const weekViewStyle = useAnimatedStyle(() => {
    const weekViewOpacity = interpolate(
      weekMonthContainerHeight.value,
      [WEEK_VIEW_HEIGHT, MONTH_VIEW_HEIGHT],
      [1, 0]
    );
    return {
      height: interpolate(
        weekMonthContainerHeight.value,
        [WEEK_VIEW_HEIGHT, MONTH_VIEW_HEIGHT],
        [WEEK_VIEW_HEIGHT, 0]
      ),
      opacity: weekViewOpacity,
    };
  });
  const monthViewStyle = useAnimatedStyle(() => {
    const monthViewOpacity = interpolate(
      weekMonthContainerHeight.value,
      [WEEK_VIEW_HEIGHT, MONTH_VIEW_HEIGHT],
      [0, 1]
    );
    return {
      opacity: monthViewOpacity,
    };
  });

  const weekDaysContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: interpolate(
        weekMonthContainerHeight.value,
        [WEEK_VIEW_HEIGHT, MONTH_VIEW_HEIGHT],
        [0, 1]
      ),
    };
  });

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={{
        backgroundColor: 'white',
        flexDirection: 'column',
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: 'white',
          },
          gestureStyle,
        ]}
      >
        <View
          style={{
            borderTopColor: '#ccc',
            borderTopWidth: 1,
            paddingHorizontal: 8,
          }}
        >
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={{
                paddingTop: 8,
                alignItems: 'center',
                width: '100%',
              }}
            >
              <TouchableHighlight
                onPress={() => {
                  if (weekMonthContainerHeight.value === WEEK_VIEW_HEIGHT) {
                    showMonthView();
                  } else {
                    hideMonthView();
                  }
                }}
                hitSlop={{
                  left: WINDOW_WIDTH / 2 - WEEK_MONTH_TOGGLER_WIDTH / 2,
                  right: WINDOW_WIDTH / 2 - WEEK_MONTH_TOGGLER_WIDTH / 2,
                  top: 8,
                  bottom: 32,
                }}
              >
                <View
                  style={{
                    width: WEEK_MONTH_TOGGLER_WIDTH,
                    height: 5,
                    backgroundColor: '#444',
                    borderRadius: 5,
                    marginBottom: 8,
                  }}
                />
              </TouchableHighlight>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  marginRight: 16,
                  zIndex: 9,
                }}
              >
                <TextButton
                  hitSlop={{
                    left: 16,
                    right: 16,
                    top: 16,
                    bottom: 16,
                  }}
                  title={'Today'}
                  onPress={() => {
                    setDates(
                      dates.map((d) => ({ ...d, isSelected: isToday(d.date) }))
                    );
                    const weekViewIsPresent =
                      weekMonthContainerHeight.value === WEEK_VIEW_HEIGHT;
                    if (weekViewIsPresent) {
                      weekScrollDatePickerToDateTriggerRef?.current?.(
                        new Date()
                      );
                    } else {
                      hideMonthView();
                      weekScrollDatePickerToDateTriggerRef.current?.(
                        new Date()
                      );
                      monthScrollToTopTriggerRef?.current?.();
                    }
                  }}
                />
              </View>
            </Animated.View>
          </PanGestureHandler>
          <Animated.View
            style={[
              {
                flexDirection: 'row',
                marginTop: 8,
                paddingBottom: 4,
                borderBottomColor: '#ccc',
                marginHorizontal: -8,
              },
              weekDaysContainerAnimatedStyle,
            ]}
          >
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              return (
                <Text
                  key={index}
                  style={{
                    width: Dimensions.get('window').width / 7,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  {day[0]?.toUpperCase()}
                </Text>
              );
            })}
          </Animated.View>
        </View>
        <WeekViewRaw
          style={weekViewStyle}
          dates={dates}
          setScrollDatePickerToDateTrigger={(trigger) => {
            weekScrollDatePickerToDateTriggerRef.current = trigger;
          }}
          onPressDate={(date) => {
            setDates(dates.map((d) => ({ ...d, isSelected: d.date === date })));
          }}
          timeslots={timeslots}
        />
        <MonthView
          startDate={startDate}
          endDate={endDate}
          selectedDate={selectedDay}
          style={monthViewStyle}
          timeslots={timeslots}
          onPressDate={(selectedDate) => {
            setDates(
              dates.map((d) => ({
                ...d,
                isSelected: isSameDay(d.date, selectedDate),
              }))
            );
            weekScrollDatePickerToDateTriggerRef?.current?.(selectedDate);
            hideMonthView();
          }}
          setScrollToTopTrigger={(trigger) => {
            monthScrollToTopTriggerRef.current = trigger;
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
