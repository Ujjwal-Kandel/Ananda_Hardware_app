import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';

import {Icon, Card, Input, Menu, MenuItem, Text} from '@ui-kitten/components';
import {
  getCompanyCategories,
  getAllProducts,
  getCompanyCategoriesProducts,
} from '../database/realm';
import {
  useNavigation,
  useFocusEffect,
  useNavigationState,
  useRoute,
} from '@react-navigation/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NoSearchResults} from '../components/nosearchresults';
import {ProductQuantityIcon} from './CompaniesScreen';
import TextTicker from 'react-native-text-ticker';
import {ListTypeSeparator} from './CompanyProductsScreen';

const filter = (item, query) =>
  item.toLowerCase().startsWith(query.toLowerCase());

export const CompanyCategories = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const previousRoutes = useNavigationState(state => state.routes);
  function getCategories() {
    return getCompanyCategories(companyName);
  }
  const props = route.params;
  const [companyName, setCompanyName] = useState(props.companyName);
  const [searchCategory, setSearchCategory] = useState(null);
  const [data, setData] = useState(getCategories());

  useFocusEffect(
    useCallback(() => {
      setData(getCategories());
    }, [previousRoutes]),
  );

  const onChangeText = query => {
    setSearchCategory(query);
    setData(getCategories().filter(item => filter(item, query)));
  };

  function CategoriesListView() {
    const getCategoryQuantity = category => {
      let products = getCompanyCategoriesProducts(category, companyName);
      return products.length;
    };
    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={ListTypeSeparator}
        ItemSeparatorComponent={ListTypeSeparator}
        renderItem={({item, index}) => {
          return (
            <MenuItem
              style={styles.card}
              onPress={() =>
                navigation.navigate('Products', {
                  companyName: companyName,
                  category: item,
                })
              }
              title={() => (
                <View style={styles.cardTextContainer}>
                  <TextTicker
                    duration={4000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}>
                    {item}
                  </TextTicker>
                </View>
              )}
              accessoryRight={() => {
                return (
                  <ProductQuantityIcon quantity={getCategoryQuantity(item)} />
                );
              }}
            />
          );
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Input
        placeholder="Category name"
        value={searchCategory}
        onChangeText={onChangeText}
      />
      {data.length === 0 ? <NoSearchResults /> : <CategoriesListView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    height: hp('10%'),
  },
  cardText: {
    fontFamily: 'Lato-Regular',
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cardTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  container: {
    // width: '100%',
    // borderRadius: 15,
    // marginLeft: '2%',
    flex: 1,
  },
});
