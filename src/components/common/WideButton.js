import React from 'react';
import {Button, Spinner, Text, useTheme} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';

function WideButton({
  width,
  onPress,
  bgcolor,
  text,
  disabled = false,
  textColor,
  accessoryLeft,
  isSubmitting,
  isLoading = false,
  extraStyle,
  size,
  ...props
}) {
  const theme = useTheme();
  return (
    <Button
      {...props}
      accessoryLeft={accessoryLeft}
      disabled={disabled}
      onPress={onPress}
      size={size}
      style={[styles.button(disabled, bgcolor, theme, width), extraStyle]}>
      {!isLoading ? (
        evaProps => (
          <Text
            {...evaProps}
            category="s1"
            style={styles.buttonText(disabled, textColor)}>
            {text}
          </Text>
        )
      ) : (
        <View>
          <Spinner size="small" />
        </View>
      )}
    </Button>
  );
}

export default WideButton;

const styles = StyleSheet.create({
  button: (disabled, bgcolor, theme, width) => ({
    minWidth: width || '95%',
    backgroundColor: disabled
      ? theme['color-basic-500']
      : bgcolor || theme['color-primary-default'],
    borderColor: disabled
      ? theme['color-basic-500']
      : bgcolor || theme['color-primary-default'],
    marginVertical: 5,
  }),
  buttonText: (disabled, textColor) => ({
    color: disabled ? '#888' : textColor || '#fff',

    // textTransform: 'uppercase',
  }),
});
