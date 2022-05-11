import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Modal, Spinner, Card, Text} from '@ui-kitten/components';

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

  useEffect(() => {
    if (syncStatus?.title === 'Sync successful!') {
      // cart reset
      dispatch(resetCart());
      // reset the router history and navigate back to browse screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'BrowseStackScreen'}],
        }),
      );
    }
  }, [syncStatus, navigation, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.primaryRectangleContainer}>
        <Text style={[styles.syncText]}>Sync the app to load products</Text>
        <TouchableOpacity
          onPress={handleSyncPress}
          style={styles.buttonContainer}>
          <Text>SYNC</Text>
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
                <SyncStatus status={syncStatus} />
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
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    height: hp('10%'),
    width: wp('30%'),
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  modalMsgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryRectangleContainer: {
    backgroundColor: '#F5E5DA',
    // width: wp('93%'),
    height: hp('50%'),
    margin: 15,
    marginTop: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncText: {
    // fontFamily: 'Lato-Regular',
    // color: '#191919',
    // fontSize: 30,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  fetchingText: {fontSize: 24, marginBottom: 10},
});
