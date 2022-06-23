import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import defaultImage from '../../assets/original_icon.png';
import {useTheme, Text, Card, Divider, Spinner} from '@ui-kitten/components';

import {getPurchaseHistory, setFetchOrderStatus} from '../../slices/cartSlice';

export const itemSeparator = () => <View style={{height: 5}} />;

const Orders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const orders = useSelector(state => state.cart.orders);
  const fetchOrdersStatus = useSelector(state => state.cart.fetchOrdersStatus);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getPurchaseHistory());
  };

  useEffect(() => {
    if (fetchOrdersStatus === 'success') {
      setRefreshing(false);
      dispatch(setFetchOrderStatus({status: 'idle'}));
      ToastAndroid.show('Fetched orders successfully', ToastAndroid.SHORT);
    } else if (fetchOrdersStatus === 'rejected') {
      ToastAndroid.show('Failed to fetch orders', ToastAndroid.SHORT);
      setTimeout(() => {
        dispatch(setFetchOrderStatus({status: 'idle'}));
        setRefreshing(false);
      }, 1500);
    }
  }, [fetchOrdersStatus]);

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item, index}) => (
    <Card
      header={() => (
        <View style={styles.headerContainer}>
          <Text category="s1">Order Code: {item.order_code}</Text>
          <Text category={'s2'}>{item.date}</Text>
        </View>
      )}>
      <View
        style={{
          paddingHorizontal: 5,
          justifyContent: 'space-between',
          width: '100%',
        }}>
        {React.Children.toArray(
          item.items.map((el, index) => (
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  marginRight: 10,
                  justifyContent: 'center',
                }}>
                <Text>{(index + 1).toString()}</Text>
              </View>
              <View style={{marginBottom: 5}}>
                <Text>Name: {el.pname}</Text>
                <Text>Quantity: {el.quantity}</Text>
                <Text>Code: {el.code}</Text>
              </View>
              <Divider />
            </View>
          )),
        )}
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Spinner />
      </View>
    );
  }

  return (
    <FlatList
      style={{marginTop: 10}}
      data={orders}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={() => (
        <View style={{paddingVertical: 5}}>
          <Text category={'h6'}>Today's Orders</Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={itemSeparator}
      ListFooterComponent={itemSeparator}
    />
  );
};

export default Orders;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});
