import { format, isToday as isTodayFNS } from 'date-fns';
import React from 'react';
import {
  Dimensions,
  Text,
  TouchableHighlight,
  View,
  ViewProps,
} from 'react-native';

export const ITEM_MARGINS = 12;
export const ITEM_WIDTH_WITHOUT_MARGINS = Dimensions.get('window').width / 7;
export const ITEM_WIDTH =
  (Dimensions.get('window').width - ITEM_MARGINS * 2 * 7) / 7;

export type DatePickerItemProps = {
  isSelected: boolean;
  date: Date;
  hasSlots: boolean;
  onPressDate: (item: Date) => void;
  showDayChar?: boolean;
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
  showDayChar = true,
  ...props
}) => {
  let color: string = '#000';
  let backgroundColor: string = 'transparent';
  const isToday = isTodayFNS(date);

  if (isDisabled) {
    color = '#ccc';
  } else {
    if (isToday) {
      color = 'blue';
    }
    if (isSelected) {
      color = '#ddd';
      if (isToday) {
        backgroundColor = 'blue';
      } else {
        backgroundColor = '#333';
      }
    }
  }
  const showDots = !isDisabled;

  const dayNumber = format(date, 'dd');

  return (
    <View {...props}>
      {showDayChar ? (
        <Text style={{ textAlign: 'center', marginBottom: 12 }}>
          {format(date, 'E')[0]}
        </Text>
      ) : null}
      <TouchableHighlight
        onPress={() => {
          onPressDate(date);
        }}
        disabled={isDisabled}
      >
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View
            key={date.toISOString()}
            style={{
              width: itemWidth ?? ITEM_WIDTH,
              backgroundColor,
              height: ITEM_WIDTH,
              borderRadius: ITEM_WIDTH,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: ITEM_MARGINS,
            }}
          >
            <Text style={{ textAlign: 'center', color, fontSize: 18 }}>
              {dayNumber?.startsWith('0') ? dayNumber.slice(1) : dayNumber}
            </Text>
          </View>
          {hasSlots && showDots ? (
            <View
              style={{
                marginTop: 4,
                width: 5,
                height: 5,
                borderRadius: 5,
                backgroundColor: isSelected ? backgroundColor : 'blue',
              }}
            />
          ) : null}
        </View>
      </TouchableHighlight>
    </View>
  );
};

const DatePickerItem = React.memo(
  DatePickerItemRaw,
  (prev, next) =>
    prev.isSelected === next.isSelected && prev.hasSlots === next.hasSlots
);

export default DatePickerItem;
