import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {
  getAllProducts,
  addProduct,
  deleteAllProduct,
  syncData,
} from '../database/realm';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FalsyText} from '@ui-kitten/components/devsupport';

export default function settings() {
  const [data, setData] = useState(getAllProducts());
  const [syncError, toggleError] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  let combinedFunc = async () => {
    setIsLoading(true);
    try {
      await syncData();
      setIsLoading(false);
      setError('Sync succesful! Your products are updated.');
    } catch (err) {
      setError(
        'Sync failed. Please make sure you are connected to the internet or contact your data provider and try again.',
      );
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView>
      <View style={styles.RectangleShapeView}>
        <View style={{padding: 20}} />
        <View style={{padding: 5}} />
        <View style={styles.butt}>
          <Text style={styles.buttText}>[Sync the app to load products]</Text>
        </View>
        <TouchableOpacity
          style={styles.Rectangle7}
          onPress={() => combinedFunc()}>
          <Text style={styles.text1}> SYNC </Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <View style={styles.errCont}>
            {error === 'Sync succesful! Your products are updated.' ? (
              <Text style={styles.errText1}> {error} </Text>
            ) : (
              <Text style={styles.errText}> {error} </Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  RectangleShapeView: {
    position: 'absolute',
    marginTop: 50,
    marginLeft: 15,
    width: wp('93%'),
    height: hp('70%'),
    backgroundColor: '#F5E5DA',
    borderRadius: 20,
  },
  Rectangle7: {
    alignContent: 'center',
    alignItems: 'center',
    width: wp('35%'),
    height: hp('7%'),
    marginLeft: '30%',
    marginTop: '50%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  text1: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  butt: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('50%'),
    marginTop: '30%',
    marginLeft: '7%',
  },
  buttText: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 22,
    lineHeight: 24,
  },
  errText: {
    fontFamily: 'Lato-Regular',
    color: '#FF0000',
    fontSize: 16,
    lineHeight: 24,
  },
  errText1: {
    fontFamily: 'Lato-Regular',
    color: '#00FF00',
    fontSize: 16,
    lineHeight: 24,
  },
  errCont: {
    alignItems: 'center',
    width: wp('85%'),
    marginTop: '30%',
    marginLeft: '5%',
    marginRight: '5%',
  },
});
