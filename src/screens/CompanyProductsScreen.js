import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {Card, Input, Divider, TabView, Tab} from '@ui-kitten/components';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  useNavigationState,
} from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {capitalize} from 'lodash';
import {LogBox} from 'react-native';

import defaultImage from '../assets/original_icon.png';

LogBox.ignoreLogs([
  'react-native-text-ticker: could not calculate metrics nodehandle_not_found',
]);

import {getAllProducts} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';
import ListProduct from '../components/CompanyProductScreen/ListProduct';

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

const {height, width} = Dimensions.get('window');

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
      'category == $0 && cname == $1',
      isMounted.current.category,
      String(isMounted.current.companyName).toUpperCase(),
    );
  }, [category, companyName]);

  const [data, setData] = useState(CompanyProducts());

  useFocusEffect(
    React.useCallback(() => {
      console.log({previousRoute});
      setData(() => {
        console.log('eta...........');
        return getAllProducts().filtered(
          'category == $0 && cname == $1',
          isMounted.current.category,
          String(isMounted.current.companyName).toUpperCase(),
        );
      });
    }),
    [route.params],
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

  const gridItems = ({item, index}) => {
    return (
      <Card
        onPress={() => {
          navigation.navigate('Details', {
            code: item.code,
          });
        }}
        style={styles.card}
        status={item.stock <= 5 ? 'danger' : 'success'}>
        <Image style={styles.gridImage} source={{uri: item.image[0]}} />
        <Divider />
        <TextTicker
          style={[styles.namecode]}
          duration={4000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}>
          {item.pname}
        </TextTicker>
        <Text style={styles.price}> Rs: {item.price} </Text>
      </Card>
    );
  };
  const [selectedIndex, setSelectedIndex] = useState(0);

  const shouldLoadComponent = index => index === selectedIndex;

  function ListView() {
    return (
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
            renderItem={gridItems}
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
                <ListProduct
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
    );
  }

  return (
    <>
      <Input
        style={{marginTop: 5}}
        placeholder="Product name"
        value={searchProduct}
        onChangeText={onChangeText}
      />
      <View style={{marginTop: 5}} />
      {data === 0 ? <NoSearchResults /> : <ListView />}
    </>
  );
};

const styles = StyleSheet.create({
  headerTextTickerStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerStyles: {
    paddingBottom: 10,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    margin: 2,
    // marginTop: '2%',
    width: width / 2,
    // marginLeft: '2%',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    width: wp('50%'),
  },
  gridContainer: {
    position: 'relative',
    width: '100%',
    alignSelf: 'center',
    paddingTop: 5,
  },
  gridImage: {
    flex: 1,
    width: wp('33%'),
    height: hp('20%'),
    resizeMode: 'contain',
  },
  namecode: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
    width: wp('100%'),
  },
  price: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'left',
    width: 150,
  },
  tabContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
