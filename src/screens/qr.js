import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/core';

import {getAllProducts} from '../database/realm';
// import {NoSearchResults} from '../components/nosearchresults';
import {Modal, Card} from '@ui-kitten/components';

export default function ScanScreen() {
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    setVisible(false);
  }, []);
  const navigation = useNavigation();
  const onSuccess = e => {
    console.log({e});
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
          <Text style={styles.text}>Place the scanner above the QR code</Text>
          <QRCodeScanner
            style={{height: hp('100%')}}
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
        <Card>
          <View>
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.titleText}>No Product Found</Text>

              <Text style={styles.msgText}>QR code may be invalid.</Text>
            </View>
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
  },
  text: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 30,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingTop: hp('1%'),
    marginBottom: hp('1%'),
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
