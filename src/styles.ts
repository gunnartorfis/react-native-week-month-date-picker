import { Dimensions, StyleSheet } from 'react-native';

export const WEEK_MONTH_TOGGLER_WIDTH = 32;

const styles = StyleSheet.create({
  childrenContainer: {
    flex: 1,
  },
  panContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 8,
  },
  panAnimatedContainer: {
    paddingTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  panHandle: {
    width: WEEK_MONTH_TOGGLER_WIDTH,
    height: 5,
    borderRadius: 5,
    marginBottom: 8,
  },
  panActionRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 16,
  },
  panWeekdaysContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingBottom: 4,
    marginHorizontal: -8,
  },
  panWeekdaysText: {
    width: Dimensions.get('window').width / 7,
    textAlign: 'center',
    marginTop: 4,
  },
});

export const lightStyles = StyleSheet.create({
  animatedContainer: {
    backgroundColor: 'white',
  },
  panContainer: {
    borderTopColor: '#E6E3E3',
  },
  panHandle: {
    backgroundColor: '#302B2B',
  },
  panWeekdaysContainer: {
    borderBottomColor: '#E6E3E3',
  },
});

export const darkStyles = StyleSheet.create({
  animatedContainer: {
    backgroundColor: '#333',
  },
  panContainer: {
    borderTopColor: '#302B2B',
  },
  panHandle: {
    backgroundColor: '#C4C4C4',
  },
  panWeekdaysContainer: {
    borderBottomColor: '#302B2B',
  },
});

export default styles;
