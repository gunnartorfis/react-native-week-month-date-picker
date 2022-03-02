import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { ThemeContext } from 'react-native-week-month-date-picker';

interface TextButtonProps extends TouchableOpacityProps {
  title: string;
}

const TextButton: React.FC<TextButtonProps> = ({ title, style, ...props }) => {
  const { primaryColor } = React.useContext(ThemeContext);

  return (
    <View style={style}>
      <TouchableOpacity {...props}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: primaryColor }]}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
});

export default TextButton;
