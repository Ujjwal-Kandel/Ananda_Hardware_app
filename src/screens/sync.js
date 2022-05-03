import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Modal,
  Spinner,
  Card,
} from '@ui-kitten/components';

import {
  deleteAllProduct,
  syncData,
  syncCompany,
} from '../database/realm';
import {SyncStatus} from '../components/syncStatus';

export default function sync() {
  const [syncStatus, setSyncStatus] = useState({
    title: '',
    msg: '',
    color: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  let combinedFunc = async () => {
    setIsLoading(true);
    try {
      deleteAllProduct();
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

  return (
    <SafeAreaView>
      <View style={styles.primaryRectangleContainer}>
        <Text style={[styles.syncText, {borderRadius: 20, marginBottom: 50}]}>
          Sync the app to load products
        </Text>
        <TouchableOpacity
          onPress={handleSyncPress}
          style={styles.buttonContainer}>
          <Text style={styles.syncText}>SYNC</Text>
        </TouchableOpacity>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}>
          <Card>
            <View
              style={{
                width: 180,
                height: 120,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {isLoading ? (
                <View style={styles.modalMsgContainer}>
                  <Text
                    style={[styles.syncText, {fontSize: 24, marginBottom: 10}]}>
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
    marginLeft: 15,
    marginTop: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncText: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 30,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
