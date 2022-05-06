import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Spinner} from '@ui-kitten/components';

export function Loading() {
  return (
    <View style={styles.wrapper}>
      <Spinner size="giant" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF66',
  },
});
