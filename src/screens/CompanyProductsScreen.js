import React, {useEffect, useState, useRef, useCallback} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Input, Divider, TabView, Tab} from '@ui-kitten/components';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  useNavigationState,
} from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';

import {capitalize} from 'lodash';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'react-native-text-ticker: could not calculate metrics nodehandle_not_found',
]);

import {getAllProducts} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';
import ListItem from '../components/CompanyProductScreen/ListItem';
import GridItem from '../components/CompanyProductScreen/GridItem';

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

export function ListTypeSeparator() {
  return <View style={{margin: 1}} />;
}

export const Products = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const previousRoute = useNavigationState(state => state.routes);

  const props = route.params;
  const [searchProduct, setSearchProduct] = useState(null);
  const companyName = props.companyName;
  const category = props.category;
  const isMounted = useRef({
    companyName: '',
    category: '',
    mounted: false,
  });

  useEffect(() => {
    isMounted.current.category = props.category;
    isMounted.current.companyName = props.companyName;
  }, [props]);

  const CompanyProducts = useCallback(() => {
    return getAllProducts().filtered(
      'category ==[c] $0 && cname ==[c] $1',
      isMounted.current.category,
      String(isMounted.current.companyName).toLowerCase(),
    );
  }, []);

  const [data, setData] = useState(CompanyProducts());

  useFocusEffect(
    useCallback(() => {
      setData(() => {
        return getAllProducts().filtered(
          'category ==[c] $0 && cname ==[c] $1',
          isMounted.current.category,
          String(isMounted.current.companyName).toLowerCase(),
        );
      });
    }, [previousRoute]),
  );

  const HeaderTitle = useCallback(
    () => (
      <View style={{marginRight: 100}}>
        <TextTicker
          style={styles.headerTextTickerStyle}
          duration={4000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}>
          {`${companyName} - ${capitalize(category)}`}
        </TextTicker>
      </View>
    ),
    [companyName, category],
  );
  useEffect(() => {
    navigation.setOptions({headerTitle: () => <HeaderTitle />});
  }, [navigation, HeaderTitle]);

  useEffect(() => {
    isMounted.current.mounted = true;
    if (isMounted.current.mounted) {
      if (searchProduct) {
        let filteredData = CompanyProducts().filter(item =>
          filter(item.pname, searchProduct),
        );
        setData(filteredData);
      } else {
        setData(CompanyProducts());
      }
    }
    return () => {
      isMounted.current.mounted = false;
    };
  }, [searchProduct, CompanyProducts]);

  const onChangeText = query => {
    setSearchProduct(query);
    setData(CompanyProducts().filter(item => filter(item.pname, query)));
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  const shouldLoadComponent = index => index === selectedIndex;

  return (
    <>
      <Input
        style={{marginTop: 5}}
        placeholder="Product name"
        value={searchProduct}
        onChangeText={onChangeText}
      />
      <View style={{marginTop: 5}} />
      {data === 0 ? (
        <NoSearchResults />
      ) : (
        <TabView
          style={{flex: 1}}
          selectedIndex={selectedIndex}
          shouldLoadComponent={shouldLoadComponent}
          onSelect={index => setSelectedIndex(index)}>
          <Tab title="Grid">
            <FlatList
              numColumns={2}
              data={data}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) => (
                <GridItem
                  item={item}
                  onPress={() => {
                    navigation.navigate('Details', {
                      code: item.code,
                    });
                  }}
                />
              )}
            />
          </Tab>
          <Tab title="List">
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ListTypeSeparator}
              ListFooterComponent={ListTypeSeparator}
              renderItem={({item, index}) => {
                return (
                  <ListItem
                    item={item}
                    onPress={() =>
                      navigation.navigate('Details', {
                        code: item.code,
                      })
                    }
                  />
                );
              }}
            />
          </Tab>
        </TabView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerTextTickerStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
