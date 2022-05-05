import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';

import {Icon, Card, Input, Menu, MenuItem, Text} from '@ui-kitten/components';
import {
  getCompanyCategories,
  getAllProducts,
  getCompanyCategoriesProducts,
} from '../database/realm';
import {useNavigation} from '@react-navigation/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {capitalize} from 'lodash';
import {NoSearchResults} from '../components/nosearchresults';
import {ProductQuantityIcon} from './browse';
import TextTicker from 'react-native-text-ticker';

const filter = (item, query) =>
  item.toLowerCase().startsWith(query.toLowerCase());

export const CompanyCategories = ({route}) => {
  const props = route.params;
  const [companyName, setCompanyName] = useState(props.companyName);
  const [searchCategory, setSearchCategory] = useState(null);
  const [data, setData] = useState(getCategories());

  const navigation = useNavigation();

  const onSelect = index => {
    setSearchCategory();
    navigation.navigate('Products', {
      companyName: companyName,
      category: data[index],
    });
  };

  const onChangeText = query => {
    setSearchCategory(query);
    setData(getCategories().filter(item => filter(item, query)));
  };

  function getCategories() {
    return getCompanyCategories(companyName);
  }

  function CategoriesListView() {
    const categoryQuantity = 10;

    const getCategoryQuantity = category => {
      let products = getCompanyCategoriesProducts(category, companyName);
      return products.reduce((acc, el) => el.stock + acc, 0);
    };
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: hp('30%')}} />}
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
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Input
        placeholder="Category name"
        value={searchCategory}
        onChangeText={onChangeText}
      />
      {data === 0 ? <NoSearchResults /> : <CategoriesListView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 2,
    marginTop: '5%',
    height: hp('8%'),
    marginLeft: '2%',
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
    position: 'relative',
    width: wp('95%'),
    borderRadius: 15,
    marginLeft: '2%',
  },
});
