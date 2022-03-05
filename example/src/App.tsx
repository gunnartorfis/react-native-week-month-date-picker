import { addDays } from 'date-fns';
import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DatePicker } from 'react-native-week-month-date-picker';

export default function App() {
  const minDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState(
    addDays(new Date(), 0)
  );

  return (
    <SafeAreaView style={styles.container}>
      <DatePicker
        minDate={minDate}
        maxDate={addDays(minDate, 120)}
        markedDates={[minDate, addDays(new Date(), 2)]}
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
        allowsPastDates={false}
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
