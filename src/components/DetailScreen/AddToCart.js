import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {Icon, Text, Button, useTheme} from '@ui-kitten/components';

import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  selectCartItemByCode,
  selectCartItemCount,
} from '../../slices/cartSlice';

const AddToCart = ({product, setIsModalVisible}) => {
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
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.elementContainer,
            {backgroundColor: theme['color-basic-200']},
          ]}
          onPress={() => {
            decrementHandler();
          }}>
          <Icon
            name="minus-outline"
            style={styles.iconSize}
            fill={theme['color-basic-1100']}
          />
        </TouchableOpacity>
        <View style={[styles.elementContainer, {flex: 0.75}]}>
          <Text category="h5">{itemCount}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.elementContainer,
            {
              backgroundColor: isAddToCartIncrementorDisabled
                ? theme['color-danger-300']
                : theme['color-basic-200'],
            },
          ]}
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
        size="medium"
        onPress={() => {
          addItemToCart();
          setItemCount(1);
          setIsModalVisible(true);
          setTimeout(() => setIsModalVisible(false), 1000);
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
    alignItems: 'center',
    backgroundColor: theme['color-basic-100'],
    flexDirection: 'row',
    padding: 10,
  }),
  container: {
    flexDirection: 'row',
    flex: 1,
    height: 45,
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
  iconSize: {
    width: 18,
    height: 18,
  },
});
