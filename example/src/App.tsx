import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { DatePicker } from 'react-native-week-month-date-picker';

export default function App() {
  return (
    <View style={styles.container}>
      <DatePicker startDate={new Date()} maxFutureDays={30} timeslots={[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
