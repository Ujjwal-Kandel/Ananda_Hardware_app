import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Icon} from '@ui-kitten/components';

export const SyncStatus = ({status}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={styles.titleText}>{status.title}</Text>
      <Icon
        name={
          status.title === 'Sync successful!'
            ? 'checkmark-circle-outline'
            : 'close-circle-outline'
        }
        style={{width: 32, height: 32}}
        fill={status.color}
      />
      <Text style={styles.msgText}>{status.msg}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 24,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  msgText: {
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});
