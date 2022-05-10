import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Text, Icon, useTheme, Button, Modal, Card} from '@ui-kitten/components';
import TextTicker from 'react-native-text-ticker';

import {useSelector, useDispatch} from 'react-redux';

import {
  selectCartItems,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  resetCart,
  placeOrder,
  resetPlaceOrderState,
} from '../../slices/cartSlice';
import {useNavigation} from '@react-navigation/core';
import {useCallback} from 'react';

const CartItem = ({cartItem, handleChange, setIsModalVisible}) => {
  const itemCount = cartItem.quantity;
  const isIncrementorDisabled = itemCount > cartItem.product.stock - 1;
  const theme = useTheme();
  const cartItemsFromRedux = useSelector(state => selectCartItems(state));

  console.log({cartItem});
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
              style={styles.quantityModifierButton}
              onPress={() => {
                handleChange('decrement', cartItem.product.id);
              }}>
              <Icon
                name="minus-outline"
                style={{width: 20, height: 20}}
                fill="#333"
              />
            </TouchableOpacity>
            <Text category="h6" style={{}}>
              {cartItem.quantity}
            </Text>
            <TouchableOpacity
              disabled={isIncrementorDisabled}
              style={[
                styles.quantityModifierButton,
                {
                  backgroundColor: isIncrementorDisabled
                    ? theme['color-danger-300']
                    : theme['color-basic-200'],
                },
              ]}
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
                if (cartItemsFromRedux.length > 1) {
                  setIsModalVisible(true);
                  setTimeout(() => {
                    setIsModalVisible(false);
                  }, 1000);
                }
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
  const navigation = useNavigation();

  const cartItemsFromRedux = useSelector(state => selectCartItems(state));
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const [cartTotal, setCartTotal] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);

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
    ({item, index}) => (
      <CartItem
        cartItem={item}
        handleChange={handleChange}
        setIsModalVisible={setIsModalVisible}
      />
    ),
    [handleChange],
  );

  const handleChange = useCallback(
    (changeType, id) => {
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
    },
    [dispatch],
  );

  if (isCartEmpty) {
    return (
      <View
        style={{
          height: '100%',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../img/emptyCard.png')}
          resizeMode="contain"
          style={{height: 500}}
        />
        <View style={{alignItems: 'center'}}>
          <Text category="p1">There are no items in the cart.</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text category="p1" style={{color: theme['color-primary-500']}}>
              Keep Shopping
            </Text>
          </TouchableOpacity>
        </View>
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
            dispatch(placeOrder());
          }}>
          Place Order
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
      <ItemRemovedModal isModalVisible={isModalVisible} />
    </View>
  );
};

const ItemRemovedModal = ({isModalVisible}) => {
  return (
    <Modal visible={isModalVisible} backdropStyle={styles.backdrop}>
      <Card>
        <View style={{alignItems: 'center'}}>
          <Text category="h5">Item removed</Text>
          <Icon
            name={'checkmark-circle-outline'}
            style={styles.iconStyles}
            fill={'green'}
          />
        </View>
      </Card>
    </Modal>
  );
};

export default CartList;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconStyles: {
    height: 32,
    width: 32,
  },
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
  quantityModifierButton: {
    height: '100%',
    paddingVertical: 2,
    paddingHorizontal: 8,
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
