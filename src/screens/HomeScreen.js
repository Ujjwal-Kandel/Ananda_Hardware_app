import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Icon, Text, Input, Radio, RadioGroup} from '@ui-kitten/components';
import {getAllProducts, getPname} from '../database/realm';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/core';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import Orders, {itemSeparator} from '../components/HomeScreen/Orders';
import {useDispatch} from 'react-redux';
import {getPurchaseHistory} from '../slices/cartSlice';
import ListItem from '../components/CompanyProductScreen/ListItem';

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

const DATA = getAllProducts();
export default function Home(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getPurchaseHistory());
  }, []);
  //for search
  const [searchQuery, setSearchQuery] = useState(null);
  const [advancedSearchToggle, setAdvancedSearchToggle] = useState(false);

  // for product autocomplete search
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [filteredData, setFilteredData] = useState(DATA);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    setFilteredData(getAllProducts());
  }, []);

  const productSearchRef = useRef();
  const onCheckedChange = isChecked => {
    setAdvancedSearchToggle(isChecked);
  };

  const onChangeSearch = query => {
    setShowAutoComplete(true);
    setSearchQuery(query);
  };

  //for radiobutton to select search type:
  const [value, setValue] = useState(0);

  const handleSearchSubmit = () => {
    if (searchQuery) {
      props.navigation.push('Result', {searchQuery, value});
      setSearchQuery('');
    }
  };

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({item, index}) => (
    <ListItem
      item={item}
      onPress={() =>
        navigation.navigate('Details', {
          code: item.code,
        })
      }
    />
  );

  const ClearSearchButton = () => {
    return (
      <Pressable
        onPress={() => {
          setShowAutoComplete(false);
          productSearchRef?.current.blur();
          setProductName('');
        }}>
        <Icon
          name="close-outline"
          style={{height: 20, width: 24}}
          fill="#000"
        />
      </Pressable>
    );
  };
  const SearchToggle = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 5,
      }}>
      <Text category="s2">Advanced Search</Text>
      <Switch
        trackColor={{false: '#767577', true: '#69Dd3E'}}
        thumbColor={advancedSearchToggle ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onCheckedChange}
        value={advancedSearchToggle}
        style={{marginRight: 10}}
      />
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <SearchToggle />
        <View style={{flex: 1}}>
          {advancedSearchToggle ? (
            <View>
              <Input
                placeholder="Product Name or Code"
                value={searchQuery}
                onChangeText={onChangeSearch}
                onSubmitEditing={handleSearchSubmit}
                onIconPress={handleSearchSubmit}
                style={styles.SearchProduct}
              />
              <View style={{alignItems: 'center', padding: 20}}>
                <RadioGroup
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    paddingHorizontal: '10%',
                  }}
                  onChange={index => setValue(index)}
                  selectedIndex={value}>
                  <Radio>
                    <View style={{}}>
                      <Text
                        category="h6"
                        style={{
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}>
                        Starts With
                      </Text>
                    </View>
                  </Radio>
                  <Radio>
                    <View>
                      <Text category="h6">Contains</Text>
                    </View>
                  </Radio>
                </RadioGroup>
              </View>
              <View
                style={{
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                  width: 'auto',
                  padding: 20,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={handleSearchSubmit}
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    category="h4"
                    style={{textAlign: 'center', textAlignVertical: 'center'}}>
                    SEARCH
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{paddingHorizontal: 10, flex: 1}}>
              <Input
                placeholder="Product Name"
                style={styles.SearchProduct}
                onFocus={() => {
                  // setShowAutoComplete(true);
                }}
                ref={productSearchRef}
                onBlur={() => {
                  // setTimeout(() => setShowAutoComplete(false), 1000);
                }}
                onChangeText={val => {
                  if (val !== '') {
                    setShowAutoComplete(true);
                  } else {
                    setShowAutoComplete(false);
                  }
                  setProductName(val);
                }}
                accessoryRight={<ClearSearchButton />}
                value={productName}
              />
              {!showAutoComplete && <Orders />}

              {filteredData && showAutoComplete ? (
                <FlatList
                  data={filteredData.filter(
                    el =>
                      String(el.pname)
                        .toLowerCase()
                        .includes(productName.toLowerCase()) ||
                      String(el.code)
                        .toLowerCase()
                        .includes(productName.toLowerCase()),
                  )}
                  ItemSeparatorComponent={itemSeparator}
                  ListHeaderComponent={itemSeparator}
                  ListFooterComponent={itemSeparator}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                />
              ) : null}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  Dividor: {paddingHorizontal: 18},
  SearchProduct: {
    borderRadius: 15,
  },
  RadioButtonWrapper: {
    flexDirection: 'row',
    marginLeft: '0%',
    marginTop: 20,
  },
  RadioButton: {
    backgroundColor: '#E7E7E7',
    borderRadius: 14,
  },
  AutocompleteItem: {
    paddingVertical: 10,
    marginTop: 3,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  AutocompleteArea: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 5,
  },

  RectangleShapeView: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#F5E5DA',
    borderRadius: 20,
    width: wp('93%'),
    height: hp('20%'),
  },
  Rectangle2: {
    position: 'absolute',
    flex: 1,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Rectangle3: {
    flexDirection: 'row',
    width: wp('35%'),
    height: hp('5%'),
    backgroundColor: '#E7E7E7',
    borderRadius: 7,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Montserrat-Bold',
    marginLeft: 10,
    fontSize: 36,
    fontWeight: '700',
  },
  searchContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('7%'),
    width: wp('35%'),
    marginTop: hp('16%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  searchText: {
    fontFamily: 'Lato-Regular',
    color: '#191919',

    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text1: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 17,
    fontWeight: '400',
  },
});
