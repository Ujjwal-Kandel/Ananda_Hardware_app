// SHOWS THE RESULT FROM SEARCH
import React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {getAllProducts} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';
import ListProduct from '../components/CompanyProductScreen/ListProduct';

export default function SearchRes({route}) {
  const navigation = useNavigation();
  let props = route.params;
  let input = props.searchQuery.toString();
  function Containing() {
    return getAllProducts().filtered(
      'pname CONTAINS[c] $0 || code CONTAINS[c] $0',
      input,
    );
  }
  function startsWith() {
    return getAllProducts().filtered(
      'code BEGINSWITH[c] $0 || pname BEGINSWITH[c] $0',
      input,
    );
  }

  function ProductListings({data}) {
    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={<View style={{height: hp('5%')}} />}
        renderItem={({item, index}) => {
          return (
            <ListProduct
              item={item}
              isResultPage
              onPress={() =>
                navigation.navigate('Details', {
                  name: item.pname,
                  img: item.image,
                  stk: item.stock,
                  code: item.code,
                  dimen: item.dimension,
                  price: item.price,
                })
              }
            />
          );
        }}
      />
    );
  }

  function Second() {
    if (Containing() === 0) {
      return <NoSearchResults />;
    }
    return <ProductListings data={Containing()} />;
  }
  function First() {
    if (startsWith() === 0) {
      return <NoSearchResults />;
    }

    return <ProductListings data={startsWith()} />;
  }

  return (
    <SafeAreaView>
      {props.value === 'first' ? <First /> : <Second />}
    </SafeAreaView>
  );
}
