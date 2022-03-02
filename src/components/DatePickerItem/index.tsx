import { format, isToday as isTodayFNS } from 'date-fns';
import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { ThemeContext } from 'react-native-week-month-date-picker';
import styles, { ITEM_WIDTH } from './styles';

export type DatePickerItemProps = {
  isSelected: boolean;
  date: Date;
  hasSlots: boolean;
  onPressDate: (item: Date) => void;
  itemWidth?: number;
  isDisabled?: boolean;
};

const DatePickerItemRaw: React.FC<DatePickerItemProps & ViewProps> = ({
  isSelected,
  date,
  hasSlots,
  onPressDate,
  itemWidth,
  isDisabled,
  ...props
}) => {
  const { primaryColor } = React.useContext(ThemeContext);

  let color: string = '#000';
  let backgroundColor: string = 'transparent';
  const isToday = isTodayFNS(date);

  if (isDisabled) {
    color = '#ccc';
  } else {
    if (isToday) {
      color = primaryColor;
    }
    if (isSelected) {
      color = '#ddd';
      if (isToday) {
        backgroundColor = primaryColor;
      } else {
        backgroundColor = '#333';
      }
    }
  }
  const showDots = !isDisabled;

  const dayNumber = format(date, 'dd');

  return (
    <View {...props}>
      <TouchableOpacity
        onPress={() => {
          onPressDate(date);
        }}
        disabled={isDisabled}
      >
        <View style={styles.dotAndTextContainer}>
          <View
            key={date.toISOString()}
            style={[
              styles.dayNumberContainer,
              {
                width: itemWidth ?? ITEM_WIDTH,
                backgroundColor,
              },
            ]}
          >
            <Text style={[styles.dayNumberText, { color }]}>
              {dayNumber?.startsWith('0') ? dayNumber.slice(1) : dayNumber}
            </Text>
          </View>
          {hasSlots && showDots ? (
            <View
              style={[
                styles.dot,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor: isSelected ? backgroundColor : primaryColor,
                },
              ]}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const DatePickerItem = React.memo(
  DatePickerItemRaw,
  (prev, next) =>
    prev.isSelected === next.isSelected && prev.hasSlots === next.hasSlots
);

export default DatePickerItem;
