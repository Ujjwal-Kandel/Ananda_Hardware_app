// SHOWS THE RESULT FROM QR-Scanner

import React, {useState} from 'react';
import {StyleSheet, View, SafeAreaView, Text, FlatList} from 'react-native';
import {Card} from '@ui-kitten/components';
import {getAllProducts} from '../database/realm';
import {useNavigation} from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ResultComponent({route}) {
  const navigation = useNavigation();
  let props = route.params;
  function qrcontains() {
    return getAllProducts().filtered('code == $0', props.a);
  }

  function QrFilter() {
    if (qrcontains() == 0) {
      return (
        <View style={styles.errCont}>
          <Text style={styles.errText}> No data available</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={qrcontains()}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: hp('5%')}} />}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                <Card
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('Details', {
                      name: item.pname,
                      img: item.image,
                      stk: item.stock,
                      code: item.code,
                      dimen: item.dimension,
                      price: item.price,
                    })
                  }
                  status={item.stock <= 5 ? 'danger' : 'success'}>
                  <TextTicker
                    style={([styles.namecode], {fontSize: 20})}
                    duration={4000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}>
                    {item.pname}
                  </TextTicker>
                  <View style={{padding: 13}} />
                  <Text style={styles.namecode}>"{item.category}"</Text>
                  <Text style={styles.price}> Rs: {item.price} </Text>
                </Card>
              </View>
            );
          }}
        />
      );
    }
  }
  return (
    <SafeAreaView>
      <View style={{padding: 10}} />
      <QrFilter />
      <View style={{padding: 20}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#F5E5DA',
    width: wp('92%'),
    height: hp('13%'),
    marginLeft: 15,
    margin: 2,
  },
  price: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 65,
    position: 'absolute',
    marginLeft: 266,
    width: 150,
  },
  namecode: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 0,
  },
  Rectangle7: {
    alignContent: 'center',
    alignItems: 'center',
    width: 170,
    height: 50,
    marginLeft: 120,
    marginTop: 120,
    backgroundColor: '#F5E5DA',
    borderRadius: 20,
  },
  text1: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  errCont: {
    alignItems: 'center',
    width: wp('85%'),
    marginTop: '30%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  errText: {
    fontFamily: 'Lato-Regular',
    color: '#FF0000',
    fontSize: 16,
    lineHeight: 24,
  },
});
