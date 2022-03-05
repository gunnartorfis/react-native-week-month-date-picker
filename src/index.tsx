import { addDays, differenceInDays, endOfWeek, startOfWeek } from 'date-fns';
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

export type DatePickerProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  markedDates?: Date[];
  disabledDates?: Date[];
  allowsPastDates?: boolean;
  theme?: {
    primaryColor?: string;
  };
  locale?: string;
};

export const ThemeContext = React.createContext<{
  primaryColor: string;
}>({
  primaryColor: 'blue',
});

export const DatePickerComponent: React.FC<DatePickerProps> = ({
  selectedDate,
  minDate = new Date(),
  maxDate = addDays(new Date(), 90),
  markedDates = [],
  disabledDates = [],
  children,
  onDateChange,
  allowsPastDates,
  theme,
  locale = 'en',
}) => {
  const weekScrollDatePickerToDateTriggerRef =
    React.useRef<(date: Date) => void>();
  const monthScrollToTopTriggerRef = React.useRef<() => void>();

  const dates = React.useMemo(() => {
    return generateDateRange({
      startDate: startOfWeek(minDate, {
        weekStartsOn: 1, // Monday
      }),
      endDate: maxDate,
      disabledDates,
      allowsPastDates,
    });
  }, [minDate, maxDate, disabledDates, allowsPastDates]);

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
                      const dateToScrollTo =
                        differenceInDays(minDate, new Date()) > 0
                          ? minDate
                          : new Date();
                      updateSelectedDate(dateToScrollTo);
                      const weekViewIsPresent =
                        weekMonthContainerHeight.value === WEEK_VIEW_HEIGHT;
                      if (weekViewIsPresent) {
                        weekScrollDatePickerToDateTriggerRef?.current?.(
                          dateToScrollTo
                        );
                      } else {
                        hideMonthView();
                        weekScrollDatePickerToDateTriggerRef.current?.(
                          dateToScrollTo
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
              {generateDateRange({
                startDate: startOfWeek(new Date(), {
                  weekStartsOn: 1, // Monday
                }),
                endDate: endOfWeek(new Date(), {
                  weekStartsOn: 1,
                }),
                allowsPastDates: true,
                disabledDates: [],
              }).map(({ date }) => {
                return (
                  <Text key={date.toString()} style={styles.panWeekdaysText}>
                    {date
                      .toLocaleString(locale, { weekday: 'long' })
                      .charAt(0)
                      .toUpperCase()}
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
            selectedDate={selectedDate}
          />
          <MonthView
            minDate={minDate}
            maxDate={maxDate}
            selectedDate={selectedDate}
            markedDates={markedDates}
            disabledDates={disabledDates}
            allowsPastDates={allowsPastDates}
            style={monthViewStyle}
            onPressDate={(newSelectedDate) => {
              updateSelectedDate(newSelectedDate);
              weekScrollDatePickerToDateTriggerRef?.current?.(newSelectedDate);
              hideMonthView();
            }}
            setScrollToTopTrigger={(trigger) => {
              monthScrollToTopTriggerRef.current = trigger;
            }}
            locale={locale}
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
