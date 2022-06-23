import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/core';

import {getAllProducts} from '../database/realm';
// import {NoSearchResults} from '../components/nosearchresults';
import {Modal, Card, Text} from '@ui-kitten/components';

export default function ScanScreen() {
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    setVisible(false);
  }, []);
  const navigation = useNavigation();
  const onSuccess = e => {
    if (getAllProducts().filtered('code==$0', e.data).length !== 0) {
      navigation.navigate('Details', {code: e.data});
    } else {
      setVisible(true);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {!visible && (
        <View style={styles.container}>
          <View style={{paddingVertical: 10}}>
            <Text category="h5">Place the scanner above the QR code</Text>
          </View>

          <QRCodeScanner
            style={{flex: 1}}
            fadeIn={false}
            reactivate={true}
            reactivateTimeout={6000}
            onRead={onSuccess}
            useGoogleVision={false} // if you enable mlkit, you can set this to true
            // flashMode={RNCamera.Constants.FlashMode.torch}
          />
        </View>
      )}
      <Modal visible={visible} onBackdropPress={() => setVisible(false)}>
        <Card
          style={{
            alignItems: 'center',
            flex: 1,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Text category="h5">No Product Found</Text>
            <Text category={'label'}>QR code may be invalid.</Text>
          </View>
        </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('10%'),
    flex: 1,
  },
});
