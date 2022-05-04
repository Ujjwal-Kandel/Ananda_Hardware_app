import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {Icon, Text, Button, useTheme} from '@ui-kitten/components';

import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  selectCartItemByCode,
  selectCartItemCount,
} from '../../slices/cartSlice';

const AddToCart = ({product}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [itemCount, setItemCount] = useState(1);

  const incrementHandler = () => {
    setItemCount(count => count + 1);
  };

  const decrementHandler = () => {
    if (itemCount > 1) {
      setItemCount(count => count - 1);
    }
  };

  const addItemToCart = () => {
    dispatch(
      addToCart({
        product: JSON.parse(JSON.stringify(product)),
        quantity: itemCount,
        id: product.id,
      }),
    );
  };

  const {code: productCode} = product;
  const cartQuantity = useSelector(state =>
    selectCartItemCount(state, productCode),
  );
  const cartItem = useSelector(state =>
    selectCartItemByCode(state, productCode),
  );

  const isAddToCartDisabled = cartQuantity
    ? cartQuantity + itemCount > product.stock
    : false;

  const isAddToCartIncrementorDisabled =
    itemCount > product.stock - 1 ||
    (cartQuantity ? cartQuantity + itemCount > product.stock - 1 : false);
  return (
    <View style={styles.addToCartContainer(theme)}>
      <View style={styles.cartItemCountContainer}>
        <TouchableOpacity
          onPress={() => {
            decrementHandler();
          }}>
          <Icon
            name="minus-outline"
            style={styles.iconSize}
            fill={theme['color-basic-1100']}
          />
        </TouchableOpacity>
        <View>
          <Text category="h5">{itemCount}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            incrementHandler();
          }}
          disabled={isAddToCartIncrementorDisabled}>
          <Icon
            name="plus-outline"
            style={styles.iconSize}
            fill={theme['color-basic-1100']}
          />
        </TouchableOpacity>
      </View>
      <Button
        onPress={() => {
          addItemToCart();
          setItemCount(1);
        }}
        disabled={isAddToCartDisabled}>
        <Text category="s2">Add To Cart </Text>
      </Button>
    </View>
  );
};

export default AddToCart;

const styles = StyleSheet.create({
  addToCartContainer: theme => ({
    marginTop: 'auto',
    backgroundColor: theme['color-basic-100'],
    flexDirection: 'row',
    padding: 10,
  }),
  cartItemCountContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginRight: '5%',
    borderWidth: 0.75,
    borderColor: '#ccc',
    borderRadius: 2,
  },
  iconSize: {
    width: 18,
    height: 18,
  },
});
