import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  FlatList,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {
  Icon,
  Card,
} from '@ui-kitten/components';
import {getCompanyCategories, getAllProducts} from '../database/realm';
import {useNavigation} from '@react-navigation/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {capitalize} from 'lodash';
import {NoSearchResults} from '../components/nosearchresults';

const filter = (item, query) =>
  item.toLowerCase().startsWith(query.toLowerCase());

export const companyCategories = ({route}) => {
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
    return (
      <View style={styles.container}>
        <FlatList
          numColumns={2}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: hp('30%')}} />}
          renderItem={({item, index}) => {
            return (
              <View style={{justifyContent: 'space-between', flex: 1}}>
                <Card
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('Products', {
                      companyName: companyName,
                      category: item,
                    })
                  }>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>{capitalize(item)}</Text>
                  </View>
                </Card>
              </View>
            );
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Searchbar
        placeholder="Category name"
        value={searchCategory}
        onChangeText={onChangeText}
      />
      {data == 0 ? <NoSearchResults /> : <CategoriesListView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 2,
    marginTop: '10%',
    width: wp('45%'),
    height: hp('15%'),
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
