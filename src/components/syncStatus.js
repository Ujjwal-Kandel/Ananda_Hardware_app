import React from 'react';
import {View, StyleSheet} from 'react-native';

import {Button, Icon, Text} from '@ui-kitten/components';

export const SyncStatus = ({status, onButtonPress}) => {
  return (
    <View style={styles.syncWrapper}>
      <Text style={styles.titleText}>{status.title}</Text>
      <Icon
        name={
          status.title === 'Sync successful!'
            ? 'checkmark-circle-outline'
            : 'close-circle-outline'
        }
        style={styles.iconStyles}
        fill={status.color}
      />
      <Text style={styles.msgText}>{status.msg}</Text>
      <Button size={'large'} appearance={'ghost'} onPress={onButtonPress}>
        Ok
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyles: {
    width: 32,
    height: 32,
  },
  syncWrapper: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
