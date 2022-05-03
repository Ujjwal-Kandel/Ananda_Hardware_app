import React, {useEffect, useState} from 'react';
import {StyleSheet, View, SafeAreaView, Text, FlatList} from 'react-native';
import {Icon, Card, Input} from '@ui-kitten/components';

import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {getAllCompany} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';

const filter = (item, query) =>
  item.toLowerCase().startsWith(query.toLowerCase());

export default function Browse() {
  const navigation = useNavigation();
  const [value, setValue] = React.useState(null);
  const [data, setData] = React.useState(getAllCompany());

  useEffect(() => {
    navigation.addListener('focus', () => {
      setData(getAllCompany());
    });
  }, [navigation]);

  const onChangeText = query => {
    setValue(query);
    setData(getAllCompany().filter(item => filter(item.name, query)));
  };

  function CompanyListView() {
    return (
      <View style={styles.rectangle40}>
        <FlatList
          numColumns={2}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: hp('30%')}} />}
          renderItem={({item, index}) => {
            return (
              <View style={{justifyContent: 'space-between', flex: 1}}>
                <Card
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('Categories', {
                      companyName: item.name,
                    })
                  }>
                  <View
                    style={{
                      height: '100%',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Regular',
                        color: '#000',
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Lato-Regular',
                        color: '#191919',
                        fontSize: 14,
                        fontWeight: '400',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        marginTop: 'auto',
                      }}>
                      No of products: {item.product_count}
                    </Text>
                  </View>
                </Card>
              </View>
            );
          }}
        />
      </View>
    );
  }
  return (
    <SafeAreaView>
      <Input
        placeholder="Company name"
        value={value}
        onChangeText={onChangeText}
      />
      {data === 0 ? <NoSearchResults /> : <CompanyListView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    margin: 2,
    marginTop: '10%',
    width: wp('45%'),
    height: hp('15%'),
    marginLeft: '2%',
  },
  card1: {
    backgroundColor: '#F5E5DA',
    width: wp('92%'),
    height: hp('13%'),
    marginLeft: 15,
    margin: 2,
  },
  header: {
    fontWeight: '400',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    marginLeft: '5%',
    width: wp('50%'),
    marginTop: '2%',
  },
  rectangle40: {
    position: 'relative',
    width: '95%',
    borderRadius: 15,
    marginLeft: '2%',
  },
  image1: {
    flex: 1,
    width: wp('33%'),
    height: hp('20%'),
    resizeMode: 'contain',
    // marginLeft: 30,
    // marginTop: 55,
    // borderRadius: 30,
  },
  namecode: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 0,
    width: wp('100%'),
  },
  price: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: '10%',
    width: 150,
  },
  text1: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 17,
    fontWeight: '400',
  },
  price1: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 65,
    position: 'absolute',
    marginLeft: 266,
    width: 150,
  },
  namecode1: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 0,
  },
});
