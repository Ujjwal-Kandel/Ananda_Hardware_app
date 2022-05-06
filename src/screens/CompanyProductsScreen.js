import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {
  Card,
  Input,
  Divider,
  TabView,
  Tab,
  Layout,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SwitchSelector from 'react-native-switch-selector';
import {capitalize} from 'lodash';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'react-native-text-ticker: could not calculate metrics nodehandle_not_found',
]);

import {getAllProducts} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';
import ListProduct from '../components/CompanyProductScreen/ListProduct';

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

export const Products = ({route}) => {
  const props = route.params;
  const [viewType, setViewType] = useState('grid');
  const [searchProduct, setSearchProduct] = useState(null);
  const navigation = useNavigation();
  const companyName = props.companyName;
  const category = props.category;
  const isMounted = useRef(null);
  const CompanyProducts = useCallback(() => {
    return getAllProducts().filtered(
      'category == $0 && cname == $1',
      category,
      String(companyName).toUpperCase(),
    );
  }, [category, companyName]);

  const [data, setData] = useState(CompanyProducts());
  const HeaderTitle = useCallback(
    () => (
      <TextTicker
        style={styles.headerTextTickerStyle}
        duration={4000}
        loop
        bounce
        repeatSpacer={50}
        marqueeDelay={1000}>
        {`${companyName} - ${capitalize(category)}`}
      </TextTicker>
    ),
    [companyName, category],
  );
  useEffect(() => {
    navigation.setOptions({headerTitle: () => <HeaderTitle />});
  }, [navigation, HeaderTitle]);

  useEffect(() => {
    isMounted.current = true;
    if (isMounted) {
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
      isMounted.current = false;
    };
  }, [searchProduct, CompanyProducts]);
  // const [data1, setData] = useState(getPname(companyName, category));

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
        selectedIndex={selectedIndex}
        shouldLoadComponent={shouldLoadComponent}
        onSelect={index => setSelectedIndex(index)}>
        <Tab title="Grid">
          <View style={styles.gridContainer}>
            <FlatList
              numColumns={2}
              data={data}
              keyExtractor={(_, index) => index.toString()}
              ListFooterComponent={<View style={{height: hp('30%')}} />}
              renderItem={gridItems}
            />
          </View>
        </Tab>
        <Tab title="List">
          <View>
            <View style={{padding: hp('1%')}} />
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{height: hp('50%')}} />}
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
          </View>
        </Tab>
      </TabView>
    );
  }

  return (
    <SafeAreaView>
      <Input
        placeholder="Product name"
        value={searchProduct}
        onChangeText={onChangeText}
      />
      <Divider style={styles.dividerStyles} />

      {data === 0 ? <NoSearchResults /> : <ListView />}
    </SafeAreaView>
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
    marginTop: '2%',
    width: wp('45%'),
    marginLeft: '2%',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'Lato-Regular',
    width: wp('50%'),
  },
  gridContainer: {
    position: 'relative',
    width: '95%',
    alignSelf: 'center',
    paddingTop: 10,
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
