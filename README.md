# react-native-week-month-date-picker

Date picker with a week and month view

## Installation

```sh
npm install react-native-week-month-date-picker
```

## Usage

```js
import { DatePicker } from 'react-native-week-month-date-picker';
import { addDays } from 'date-fns';

export default function App() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  return (
    <SafeAreaView>
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
