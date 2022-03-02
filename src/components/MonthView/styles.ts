import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  monthContainer: {
    marginTop: 8,
  },
  monthDaysContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  datePickerItem: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 12,
  },
  loadMoreIndicator: {
    marginTop: 12,
  },
});

export const lightStyles = StyleSheet.create({
  datePickerItem: {
    borderTopColor: '#E6E3E3',
  },
});

export const darkStyles = StyleSheet.create({
  datePickerItem: {
    borderTopColor: '#302B2B',
  },
});

export default styles;
