// SHOWS THE RESULT FROM SEARCH

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getAllProducts} from '../database/realm';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import {LogBox} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {
  addToCart,
  selectCartItemByCode,
  selectCartItemCount,
} from '../slices/cartSlice';
import {useTheme, Text, Icon, Button} from '@ui-kitten/components';
import AddToCart from './DetailScreen/AddToCart';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export const DetailScreen = ({route}) => {
  const navigation = useNavigation();
  let props = route.params;

  const [product, setProduct] = useState(
    getAllProducts().filtered('code==$0', props.code)[0],
  );

  useEffect(() => {
    navigation.setOptions({title: product.pname});
  }, []);

  const imageList = product.image;

  const renderImage = (item, index) => {
    return (
      <View
        key={index}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{uri: imageList[index]}}
          style={{height: '100%', width: '100%'}}
          resizeMode="contain"
        />
      </View>
    );
  };

  const RenderSwiper = () => {
    return (
      <Swiper
        showsButtons={false}
        width="100%"
        loop={false}
        backgroundColor="#fff"
        paginationStyle={{bottom: 10}}>
        {imageList.map(renderImage)}
      </Swiper>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{width: '100%', height: 350}}>
        <RenderSwiper />
      </View>
      <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
        <Text style={[styles.text, {fontWeight: 'bold', fontSize: 30}]}>
          {product.pname}
        </Text>
      </View>
      <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
        <Text style={styles.text}>- Code: {product.code}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text style={[styles.text, {paddingRight: 0}]}>- Stock: </Text>
          <Text
            style={[
              styles.text,
              product.stock < 5 ? {color: 'red'} : {color: 'green'},
              {paddingHorizontal: 0},
            ]}>
            {product.stock}
          </Text>
        </View>
        <Text style={styles.text}>- Dimension: {product.dimension}</Text>
      </View>
      <View style={[styles.divider, {marginTop: 10}]} />
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text style={[styles.text, {fontSize: 24}]}>Price:</Text>
        <Text
          style={[
            styles.text,
            {fontSize: 24, fontWeight: 'bold', textAlignVertical: 'top'},
          ]}>
          Rs. {product.price}
        </Text>
      </View>
      <AddToCart product={product} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: 'Lato-Regular',
    color: '#2b2b2b',
    fontWeight: '200',
    paddingHorizontal: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#8a8a8a',
    marginBottom: 10,
    opacity: 0.2,
  },
});
