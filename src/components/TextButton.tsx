import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface TextButtonProps extends TouchableOpacityProps {
  title: string;
}

const TextButton: React.FC<TextButtonProps> = ({ title, style, ...props }) => {
  return (
    <View style={style}>
      <TouchableOpacity {...props}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
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
    color: 'blue',
    fontWeight: '600',
  },
});

export default TextButton;
