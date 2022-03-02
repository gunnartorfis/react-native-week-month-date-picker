import { Dimensions, StyleSheet } from 'react-native';

export const ITEM_MARGINS = 12;
export const ITEM_WIDTH_WITHOUT_MARGINS = Dimensions.get('window').width / 7;
export const ITEM_WIDTH =
  (Dimensions.get('window').width - ITEM_MARGINS * 2 * 7) / 7;

const styles = StyleSheet.create({
  dotAndTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dayNumberContainer: {
    height: ITEM_WIDTH,
    borderRadius: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: ITEM_MARGINS,
  },
  dayNumberText: {
    textAlign: 'center',
    fontSize: 18,
  },
  dot: {
    marginTop: 4,
    width: 5,
    height: 5,
    borderRadius: 5,
  },
});

export default styles;
