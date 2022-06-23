import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';

import {Text, Icon, useTheme} from '@ui-kitten/components';
import MarqueeText from 'react-native-marquee';

import {useSelector} from 'react-redux';

import {selectCartItems} from '../../slices/cartSlice';
import defaultImage from '../../assets/original_icon.png';

const CartItem = ({cartItem, handleChange, setIsModalVisible}) => {
  const itemCount = cartItem.quantity;
  const isIncrementorDisabled = itemCount > cartItem.product.stock - 1;
  const theme = useTheme();
  const cartItemsFromRedux = useSelector(state => selectCartItems(state));

  return (
    <View style={styles.rowFlexContainer}>
      <Image
        source={{
          uri: cartItem.product.image[0],
        }}
        style={styles.productImage}
        resizeMode="contain"
        defaultSource={defaultImage}
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
          <MarqueeText
            style={{color: '#000', fontFamily: 'Raleway-Regular'}}
            marqueeOnStart={true}
            delay={1000}
            loop={true}
            speed={1}>
            {cartItem.product.pname}
          </MarqueeText>
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
              style={[
                styles.elementContainer,
                {backgroundColor: theme['color-basic-200']},
              ]}
              onPress={() => {
                handleChange('decrement', cartItem.product.id);
              }}>
              <Icon
                name="minus-outline"
                style={{width: 20, height: 20}}
                fill="#333"
              />
            </TouchableOpacity>
            <View style={styles.elementContainer}>
              <Text category="s1">{cartItem.quantity}</Text>
            </View>
            <TouchableOpacity
              disabled={isIncrementorDisabled}
              style={[
                styles.elementContainer,
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

export default CartItem;

const styles = StyleSheet.create({
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
});
