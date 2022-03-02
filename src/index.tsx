import { addDays, startOfWeek } from 'date-fns';
import moment from 'moment';
import React from 'react';
import { Dimensions, Platform, Text, useColorScheme, View } from 'react-native';
import 'react-native-gesture-handler';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MonthView from './components/MonthView';
import TextButton from './components/TextButton';
import WeekView from './components/WeekView';
import styles, {
  darkStyles,
  lightStyles,
  WEEK_MONTH_TOGGLER_WIDTH,
} from './styles';
import { generateDateRange } from './utils/generateDateRange';

export type Dates = {
  date: Date;
  isSelected: boolean;
  isDisabled: boolean;
}[];

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('screen');
const WEEK_VIEW_HEIGHT = 140;
const NAVIGATION_TITLE_HEIGHT = 70;

export type MarkedDates = Date[];

export type DatePickerProps = {
  startDate: Date;
  maxFutureDays: number;
  markedDates: MarkedDates;
  onDateChange: (date: Date) => void;
  theme?: {
    primaryColor?: string;
  };
};

export const ThemeContext = React.createContext<{
  primaryColor: string;
}>({
  primaryColor: 'blue',
});

export const DatePickerComponent: React.FC<DatePickerProps> = ({
  startDate,
  maxFutureDays,
  markedDates,
  children,
  onDateChange,
  theme,
}) => {
  const weekScrollDatePickerToDateTriggerRef =
    React.useRef<(date: Date) => void>();
  const monthScrollToTopTriggerRef = React.useRef<() => void>();

  const dates = React.useMemo(() => {
    return generateDateRange(
      startOfWeek(new Date(), {
        weekStartsOn: 1, // Monday
      }),
      addDays(startDate, maxFutureDays || 30)
    );
  }, [maxFutureDays, startDate]);

  const [selectedDay, setSelectedDay] = React.useState<Date>(startDate);
  const endDate = addDays(startDate, maxFutureDays || 30);
  const systemTheme = useColorScheme();

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

  const updateSelectedDate = (date: Date) => {
    setSelectedDay(date);
    onDateChange?.(date);
  };

  const colorStyles = systemTheme === 'light' ? lightStyles : darkStyles;

  return (
    <ThemeContext.Provider
      value={{ primaryColor: theme?.primaryColor || 'blue' }}
    >
      <SafeAreaView style={styles.childrenContainer}>{children}</SafeAreaView>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <Animated.View style={[colorStyles.animatedContainer, gestureStyle]}>
          <View style={[styles.panContainer, colorStyles.panContainer]}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={styles.panAnimatedContainer}>
                <TouchableOpacity
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
                  <View style={[styles.panHandle, colorStyles.panHandle]} />
                </TouchableOpacity>
                <View style={styles.panActionRowContainer}>
                  <TextButton
                    hitSlop={{
                      left: 16,
                      right: 16,
                      top: 16,
                      bottom: 16,
                    }}
                    title={'Today'}
                    onPress={() => {
                      updateSelectedDate(new Date());
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
                styles.panWeekdaysContainer,
                colorStyles.panWeekdaysContainer,
                weekDaysContainerAnimatedStyle,
              ]}
            >
              {[
                ...moment.weekdaysShort().slice(1),
                moment.weekdaysShort()[0],
              ].map((day, index) => {
                return (
                  <Text key={index} style={styles.panWeekdaysText}>
                    {day[0]?.toUpperCase()}
                  </Text>
                );
              })}
            </Animated.View>
          </View>
          <WeekView
            style={weekViewStyle}
            dates={dates}
            setScrollDatePickerToDateTrigger={(trigger) => {
              weekScrollDatePickerToDateTriggerRef.current = trigger;
            }}
            onPressDate={(date) => {
              updateSelectedDate(date);
            }}
            markedDates={markedDates}
            selectedDate={selectedDay}
          />
          <MonthView
            startDate={startDate}
            endDate={endDate}
            selectedDate={selectedDay}
            style={monthViewStyle}
            markedDates={markedDates}
            onPressDate={(selectedDate) => {
              updateSelectedDate(selectedDate);
              weekScrollDatePickerToDateTriggerRef?.current?.(selectedDate);
              hideMonthView();
            }}
            setScrollToTopTrigger={(trigger) => {
              monthScrollToTopTriggerRef.current = trigger;
            }}
          />
        </Animated.View>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return (
    <SafeAreaProvider>
      <DatePickerComponent {...props} />
    </SafeAreaProvider>
  );
};
