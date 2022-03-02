import { addDays } from 'date-fns';
import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DatePicker } from 'react-native-week-month-date-picker';

export default function App() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <DatePicker
        startDate={new Date()}
        maxFutureDays={90}
        markedDates={[new Date(), addDays(new Date(), 2)]}
        onDateChange={(date) => setSelectedDate(date)}
        theme={{
          primaryColor: 'purple',
        }}
      >
        <View>
          <Text>Timeslots</Text>
          <Text>{selectedDate.toString()}</Text>
        </View>
      </DatePicker>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
