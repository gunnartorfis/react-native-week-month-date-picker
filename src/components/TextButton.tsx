import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
const BUTTON_HEIGHT = 50;
import elevation from '../utils/elevation';

interface TextButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  smaller?: boolean;
  red?: boolean;
  showElevation?: boolean;
  textStyle?: TextStyle;
  useBorder?: boolean;
  containerStyle?: ViewStyle;
  icon?: JSX.Element;
}

function TextButton(props: TextButtonProps) {
  const {
    onPress,
    title,
    style,
    showElevation,
    containerStyle = {},
    icon = null,
    ...rest
  } = props;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={[showElevation && [styles.elevationContainer], style]}
        {...rest}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{title}</Text>
          {icon}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  elevationContainer: {
    ...elevation(),
    borderRadius: 20,
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    margin: 8,
  },
});

export default TextButton;
