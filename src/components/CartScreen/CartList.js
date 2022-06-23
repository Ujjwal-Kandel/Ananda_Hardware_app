import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  Text,
  Icon,
  useTheme,
  Button,
  Modal,
  Card,
  Spinner,
} from '@ui-kitten/components';
import {useSelector, useDispatch} from 'react-redux';

import {
  selectCartItems,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  placeOrder,
  selectPlaceOrderStatus,
  setPlaceOrderStatus,
  getPurchaseHistory,
} from '../../slices/cartSlice';
import {useNavigation} from '@react-navigation/core';
import {useCallback} from 'react';

import CartItem from './CartItem';

const CartList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();

  const cartItemsFromRedux = useSelector(state => selectCartItems(state));
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const [cartTotal, setCartTotal] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTextContent, setModalTextContent] = useState('Item Removed');

  useEffect(() => {
    if (cartItemsFromRedux.length > 0) {
      setIsCartEmpty(false);
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

  const placeOrderStatus = useSelector(selectPlaceOrderStatus);
  const handlePlaceOrder = () => {
    dispatch(placeOrder());
  };
  useEffect(() => {
    if (placeOrderStatus === 'loading') {
      setIsModalVisible(true);
    }
    if (placeOrderStatus === 'success') {
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
        dispatch(setPlaceOrderStatus({status: 'idle'}));
        dispatch(getPurchaseHistory());
      }, 1500);
    } else if (placeOrderStatus === 'rejected') {
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
        dispatch(setPlaceOrderStatus({status: 'idle'}));
      }, 1500);
    }
  }, [placeOrderStatus, dispatch]);

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
        <NotificationModal
          isModalVisible={isModalVisible}
          modalTextContent={modalTextContent}
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
        <Button style={{flex: 1}} onPress={handlePlaceOrder}>
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
      <NotificationModal
        isModalVisible={isModalVisible}
        modalTextContent={modalTextContent}
        placeOrderStatus={placeOrderStatus}
      />
    </View>
  );
};

const NotificationModal = ({
  isModalVisible,
  modalTextContent,
  placeOrderStatus,
}) => {
  return (
    <Modal visible={isModalVisible} backdropStyle={styles.backdrop}>
      <Card>
        {/* <View style={{alignItems: 'center'}}>
          <Text category="h5">{modalTextContent}</Text>
          <Icon
            name={'checkmark-circle-outline'}
            style={styles.iconStyles}
            fill={'green'}
          />
        </View> */}
        <View style={{alignItems: 'center'}}>
          {placeOrderStatus === 'loading' ? (
            <Spinner />
          ) : placeOrderStatus === 'success' ? (
            <>
              <Text category={'h5'}>Ordered successfully</Text>
              <Icon
                name={'checkmark-circle-outline'}
                style={styles.iconStyles}
                fill="green"
              />
            </>
          ) : (
            <>
              <Text category={'h5'}>Failed to place order</Text>
              <Icon
                name={'close-circle-outline'}
                style={styles.iconStyles}
                fill="red"
              />
            </>
          )}
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
    height: 45,
    width: '20%',
    minWidth: 145,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '5%',
    borderWidth: 0.75,
    borderColor: '#ccc',
    borderRadius: 2,
  },
  elementContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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
