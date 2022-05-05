import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Text, Icon, useTheme, Button} from '@ui-kitten/components';
import TextTicker from 'react-native-text-ticker';

import {useSelector, useDispatch} from 'react-redux';

import {
  selectCartItems,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  resetCart,
} from '../../slices/cartSlice';

const CartItem = ({cartItem, handleChange}) => {
  console.log(cartItem.product.image[0]);
  return (
    <View style={styles.rowFlexContainer}>
      <Image
        source={{
          uri: cartItem.product.image[0],
        }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TextTicker
            style={[styles.namecode]}
            duration={4000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}>
            {cartItem.product.pname}
          </TextTicker>
          <View>
            <Text category="label">Rs {cartItem.product.price}</Text>
          </View>
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.orderSizeContainer}>
            <TouchableOpacity
              onPress={() => {
                handleChange('decrement', cartItem.product.id);
              }}>
              <Icon
                name="minus-outline"
                style={{width: 20, height: 20}}
                fill="#333"
              />
            </TouchableOpacity>
            <Text category="h6">{cartItem.quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                handleChange('increment', cartItem.product.id);
              }}>
              <Icon
                name="plus-outline"
                style={{width: 20, height: 20}}
                fill="#333"
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                handleChange('remove', cartItem.product.id);
              }}>
              <Text status="danger">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const CartList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const cartItemsFromRedux = useSelector(state => selectCartItems(state));
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (cartItemsFromRedux.length > 0) {
      setIsCartEmpty(false);
      const total = 0;
      setCartTotal(() => {
        return cartItemsFromRedux
          .map(cartItem => cartItem.product.price * cartItem.quantity)
          .reduce((prev, curr) => prev + curr, 0);
      });
    } else {
      setIsCartEmpty(true);
    }

    return () => {
      setIsCartEmpty(true);
    };
  }, [cartItemsFromRedux]);

  const keyExtractor = (item, index) => index.toString();

  const renderItem = React.useCallback(
    ({item, index}) => <CartItem cartItem={item} handleChange={handleChange} />,
    [],
  );

  const handleChange = (changeType, id) => {
    console.log('product id: ', id);
    const payload = {
      id: id,
    };
    if (changeType === 'increment') {
      dispatch(incrementQuantity(payload));
    } else if (changeType === 'decrement') {
      dispatch(decrementQuantity(payload));
    } else if (changeType === 'remove') {
      dispatch(removeFromCart(payload));
    }
  };

  if (isCartEmpty) {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={require('../../img/emptyCard.png')}
          resizeMode="contain"
        />
      </View>
    );
  }
  return (
    <View style={styles.cartScreenContainer}>
      <FlatList
        data={cartItemsFromRedux}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={{margin: 5}} />}
        ListFooterComponent={() => <View style={{margin: 5}} />}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
      <View style={styles.resetButtonContainer(theme)}>
        <Button
          style={{flex: 1}}
          onPress={() => {
            dispatch(resetCart());
          }}>
          Reset
        </Button>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text category="s1">Total:</Text>
            <Text>Rs. {cartTotal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartList;

const styles = StyleSheet.create({
  cartScreenContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  orderSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 125,
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderColor: '#ddd',
  },
  productImage: {
    height: 130,
    width: '20%',
  },
  rowFlexContainer: {
    flexDirection: 'row',
    paddingVertical: 2,
    backgroundColor: '#fff',
  },
  namecode: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 0,
    width: '100%',
  },
  resetButtonContainer: theme => ({
    backgroundColor: theme['color-basic-100'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.75,
    borderColor: theme['color-basic-500'],
    padding: 10,
    elevation: 100,
  }),
});
