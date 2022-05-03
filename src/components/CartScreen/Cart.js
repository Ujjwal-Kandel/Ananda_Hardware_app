import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {Icon, Text, useTheme} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

import {useSelector} from 'react-redux';

import {selectCartItems} from '../../slices/cartSlice';

const Cart = () => {
  const theme = useTheme();
  const cartItems = useSelector(selectCartItems);
  const [cartCount, setCartCount] = useState(0);

  const getCartCount = () => {
    return cartItems.reduce((prev, next) => prev + next.quantity, 0);
  };

  useEffect(() => {
    setCartCount(getCartCount());
  }, [cartItems]);

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Cart');
      }}>
      <Icon
        name="shopping-cart-outline"
        fill={theme['color-primary-default']}
        style={{width: 28, height: 28}}
      />
      <View
        style={{
          backgroundColor: theme['color-basic-500'],
          paddingHorizontal: 5,
          borderRadius: 50,
          position: 'absolute',
          right: -10,
          top: -5,
          justifyContent: 'flex-start',
          alignItems: 'center',
          minWidth: 15,
          aspectRatio: 1,
          zIndex: 1000,
        }}>
        <Text>{cartCount}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Cart;

const styles = StyleSheet.create({});
