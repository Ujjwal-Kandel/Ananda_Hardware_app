import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {Icon, Card, Input, Spinner} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SwitchSelector from 'react-native-switch-selector';
import {capitalize} from 'lodash';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'react-native-text-ticker: could not calculate metrics nodehandle_not_found',
]);

import {getAllProducts} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

export const Products = ({route}) => {
  const props = route.params;
  const [viewType, setViewType] = useState('grid');
  const [searchProduct, setSearchProduct] = useState(null);
  const navigation = useNavigation();
  const [companyName, setCompanyName] = useState(props.companyName);
  const [category, setCategoryName] = useState(props.category);
  const isMounted = useRef(null);
  const CompanyProducts = useCallback(() => {
    return getAllProducts().filtered(
      'category == $0 && cname == $1',
      category,
      companyName,
    );
  }, [category, companyName]);

  const [data, setData] = useState(CompanyProducts());
  useEffect(() => {
    navigation.setOptions({title: companyName + ' - ' + capitalize(category)});
  }, [category, companyName, navigation]);
  useEffect(() => {
    isMounted.current = true;
    if (isMounted) {
      if (searchProduct) {
        let filteredData = CompanyProducts().filter(item =>
          filter(item.pname, searchProduct),
        );
        setData(filteredData);
      } else {
        setData(CompanyProducts());
      }
    }
    return () => {
      isMounted.current = false;
    };
  }, [searchProduct, CompanyProducts]);
  // const [data1, setData] = useState(getPname(companyName, category));

  const onChangeText = query => {
    setSearchProduct(query);
    setData(CompanyProducts().filter(item => filter(item.pname, query)));
  };

  function ListView() {
    {
      if (viewType === 'grid') {
        return (
          <View style={styles.rectangle40}>
            <FlatList
              numColumns={2}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{height: hp('30%')}} />}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <Card
                      onPress={() => {
                        navigation.navigate('Details', {
                          code: item.code,
                        });
                      }}
                      style={styles.card}
                      status={item.stock <= 5 ? 'danger' : 'success'}>
                      <Image
                        style={styles.image1}
                        source={{uri: item.image[0]}}
                      />
                      <View style={{flexDirection: 'column'}}>
                        <TextTicker
                          style={[styles.namecode]}
                          duration={4000}
                          loop
                          bounce
                          repeatSpacer={50}
                          marqueeDelay={1000}>
                          {item.pname}
                        </TextTicker>
                        <Text style={styles.price}> Rs: {item.price} </Text>
                      </View>
                    </Card>
                  </View>
                );
              }}
            />
          </View>
        );
      } else {
        return (
          <View>
            <View style={{padding: hp('1%')}} />
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{height: hp('50%')}} />}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <Card
                      onPress={() =>
                        navigation.navigate('Details', {
                          code: item.code,
                        })
                      }
                      style={styles.card1}
                      status={item.stock <= 5 ? 'danger' : 'success'}>
                      <TextTicker
                        style={[styles.namecode1]}
                        duration={4000}
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={1000}>
                        {item.pname}
                      </TextTicker>
                      <View style={{padding: 13}} />
                      <Text style={styles.namecode1}>{item.category}</Text>
                      <Text style={styles.price1}> Rs: {item.price} </Text>
                    </Card>
                  </View>
                );
              }}
            />
          </View>
        );
      }
    }
  }

  return (
    <SafeAreaView>
      <Input
        placeholder="Product name"
        value={searchProduct}
        onChangeText={onChangeText}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Text style={styles.header}>{companyName}</Text>
        <SwitchSelector
          style={{
            alignSelf: 'flex-end',
            marginRight: 10,
            width: wp('30%'),
            fontFamily: 'Lato-Regular',
            marginVertical: 10,
          }}
          textColor="#FF4E2B"
          selectedColor="#69DD3B"
          buttonColor="#dde1eb"
          hasPadding
          options={[
            {label: 'grid', value: 'grid'},
            {label: 'list', value: 'list'},
          ]}
          initial={0}
          onPress={value => setViewType(value)}
        />
      </View>
      {data == 0 ? <NoSearchResults /> : <ListView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    margin: 2,
    marginTop: '10%',
    width: wp('45%'),
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
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    width: wp('50%'),
  },
  rectangle40: {
    position: 'relative',
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
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
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#F92660',
    width: 150,
    height: 50,
    marginTop: 20,
    marginBottom: 10,
    marginRight: 15,
    padding: 5,
  },
});
