import React from 'react';
import { Text, View } from 'react-native';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b + 2);
}

export const DatePicker: React.FC<{
  date: Date;
}> = ({ date }) => {
  return (
    <View>
      <Text>Date: {date.toString()}</Text>
    </View>
  );
};
