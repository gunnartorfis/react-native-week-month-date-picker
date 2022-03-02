# React Native Week Month Date Picker

Date picker with a week and month view

<img src="https://user-images.githubusercontent.com/5333875/156450983-d504b47f-5fac-4be2-ac9d-ccdb239006e9.gif" alt="Demo" width="200"/>

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
