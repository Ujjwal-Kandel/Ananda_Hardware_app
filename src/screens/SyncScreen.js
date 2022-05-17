import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Modal,
  Spinner,
  Card,
  Icon,
  Text,
  useTheme,
} from '@ui-kitten/components';

import {SyncStatus} from '../components/syncStatus';

import {CommonActions, useNavigation} from '@react-navigation/core';
import {syncCompany, syncData} from '../database/realm';
import {useDispatch} from 'react-redux';
import {resetCart} from '../slices/cartSlice';

export default function Sync() {
  const [syncStatus, setSyncStatus] = useState({
    title: '',
    msg: '',
    color: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const dispatch = useDispatch();

  let combinedFunc = async () => {
    setIsLoading(true);
    try {
      // deleteAllProduct();
      await syncData();
      await syncCompany();
      setIsLoading(false);
      setSyncStatus({
        title: 'Sync successful!',
        msg: 'Your products are updated.',
        color: '#69DD3B',
      });
    } catch (err) {
      console.log({err});
      setSyncStatus({
        title: 'Sync failed!',
        msg: 'Check your internet connection and try again.',
        color: '#FF4E2B',
      });
    }
    setIsLoading(false);
  };

  const handleSyncPress = () => {
    combinedFunc();
    setVisible(true);
  };

  const resetNavigationHistory = () => {
    // reset the router history and navigate back to browse screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'BrowseStackScreen'}],
      }),
    );
  };

  useEffect(() => {
    if (syncStatus?.title === 'Sync successful!') {
      // cart reset
      dispatch(resetCart());
    }
  }, [syncStatus, navigation, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.primaryRectangleContainer}>
        <Text
          category={'h4'}
          style={{
            textTransform: 'capitalize',
            textAlign: 'center',
            textAlignVertical: 'center',
          }}>
          Sync the app to load products
        </Text>
        <TouchableOpacity
          onPress={handleSyncPress}
          style={styles.buttonContainer}>
          <Text category={'h5'} style={styles.syncText}>
            Sync
          </Text>
          <Icon
            name="sync-outline"
            style={styles.iconStyles}
            fill={theme['color-success-400']}
          />
        </TouchableOpacity>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}>
          <Card>
            <View style={styles.syncModalBodyContainer}>
              {isLoading ? (
                <View style={styles.modalMsgContainer}>
                  <Text style={[styles.syncText, styles.fetchingText]}>
                    Fetching Data...
                  </Text>
                  <Spinner size="giant" status="info" />
                </View>
              ) : (
                <View>
                  <SyncStatus
                    status={syncStatus}
                    onButtonPress={resetNavigationHistory}
                  />
                </View>
              )}
            </View>
          </Card>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  syncModalBodyContainer: {
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconStyles: {height: 32, width: 32},
  logoutButtonWrapper: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
  errorText: {
    fontFamily: 'Lato-Regular',
    color: '#FF4E2B',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    flexWrap: 'wrap',
  },
  successText: {
    fontFamily: 'Lato-Regular',
    color: '#69DD3B',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    flexWrap: 'wrap',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 50,
    flexDirection: 'row',
  },
  modalMsgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryRectangleContainer: {
    backgroundColor: '#F5E5DA',
    width: wp('93%'),
    height: hp('50%'),
    marginTop: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  syncText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    textTransform: 'uppercase',
    marginRight: 10,
  },
  fetchingText: {fontSize: 24, marginBottom: 10},
});
