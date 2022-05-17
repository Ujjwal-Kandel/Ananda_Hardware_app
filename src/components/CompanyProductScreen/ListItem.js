import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text} from '@ui-kitten/components';

import {capitalize} from 'lodash';
import {ProductQuantityIcon} from '../../screens/CompaniesScreen';
import {getAllProducts} from '../../database/realm';

const ListItem = ({item, isResultPage, onPress}) => {
  const getProductQuantity = () =>
    getAllProducts().filtered('code==$0', item.code)[0].stock;
  return (
    <View style={styles.wrapper}>
      <Card
        onPress={onPress}
        style={styles.cardStyles}
        status={item.stock <= 5 ? 'danger' : 'success'}>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text>{capitalize(item.pname)}</Text>
            <View style={styles.spacer} />

            {isResultPage ? (
              <Text category="p1">{capitalize(item.category)}</Text>
            ) : null}
            <View style={styles.spacer} />
            <Text category="p1"> Rs: {item.price} </Text>
          </View>
          <ProductQuantityIcon quantity={getProductQuantity(item.code)} />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    width: '80%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  spacer: {
    paddingTop: 10,
  },
  cardStyles: {
    marginHorizontal: 3,
  },
  companyNameTextStyles: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 0,
  },
  priceText: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 18,
    fontWeight: '400',
    width: 150,
  },
});

export default ListItem;
