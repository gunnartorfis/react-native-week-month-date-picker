# React Native Week Month Date Picker

Date picker with a week and month view

<img src="https://user-images.githubusercontent.com/5333875/156450983-d504b47f-5fac-4be2-ac9d-ccdb239006e9.gif" alt="Demo" width="200"/>

## Installation

```sh
npm install react-native-week-month-date-picker
```
#### Dependencies

This library needs these dependencies to be installed as peer dependencies in your project:

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-safe-area-context moment date-fns
```
> follow [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation), [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation), and [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context#getting-started) installation guide to install native dependencies properly. 

## Usage

```js
import { addDays } from 'date-fns';
import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DatePicker } from 'react-native-week-month-date-picker';

export default function App() {
  const minDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  return (
    <SafeAreaView>
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
