import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
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

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

const DATA = getPname();
export default function Home(props) {
  //for search
  const [searchQuery, setSearchQuery] = useState(null);
  const [data, setData] = useState(getPname());
  const navigation = useNavigation();
  const [advancedSearchToggle, setAdvancedSearchToggle] = useState(false);

  // for product autocomplete search
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [filteredData, setFilteredData] = useState(DATA);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    setFilteredData(getPname());
  }, []);

  const productSearchRef = useRef();
  const onCheckedChange = isChecked => {
    setAdvancedSearchToggle(isChecked);
  };

  const onSelect = name => {
    let code = getAllProducts()
      .filtered('pname==$0', name)
      .map(x => x.code)[0];

    navigation.navigate('Details', {code: code});
    setSearchQuery();
    setData(getPname());
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
    setData(getPname().filter(item => filter(item, query)));
  };

  const clearInput = () => {
    setSearchQuery();
    setData(getPname());
  };

  //for radiobutton to select search type:
  const [value, setValue] = useState(0);

  const handleSearchSubmit = () => {
    if (searchQuery) {
      props.navigation.push('Result', {searchQuery, value});
      setSearchQuery('');
      setData(getPname());
    }
  };

  const ClearSearchButton = () => {
    return (
      <Pressable
        onPress={() => {
          setShowAutoComplete(false);

          if (productName !== '') {
            productSearchRef?.current.focus();
            setShowAutoComplete(true);
          } else {
            if (productSearchRef.current) {
              productSearchRef.current.blur();
              // productSearchRef.current.focus();
            }
          }
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
      <Text
        style={{
          fontFamily: 'Lato-Regular',
          fontWeight: 'bold',
          marginRight: 3,
        }}>
        Advanced Search
      </Text>
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
    <SafeAreaView>
      <KeyboardAvoidingView>
        <SearchToggle />
        <View>
          {advancedSearchToggle ? (
            <View>
              <View style={styles.RectangleShapeView}>
                <Input
                  placeholder="Product Name or Code"
                  value={searchQuery}
                  onChangeText={onChangeSearch}
                  onSubmitEditing={handleSearchSubmit}
                  onIconPress={handleSearchSubmit}
                  style={styles.SearchProduct}
                />
                <View style={styles.Rectangle2}>
                  <View style={styles.RadioButtonWrapper}>
                    <RadioGroup
                      onChange={index => setValue(index)}
                      selectedIndex={value}>
                      <Radio>
                        <View>
                          <Text style={styles.text1}>Starts With</Text>
                        </View>
                      </Radio>
                      <Radio>
                        <View>
                          <Text style={styles.text1}>Contains</Text>
                        </View>
                      </Radio>
                    </RadioGroup>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.searchContainer}
                onPress={handleSearchSubmit}>
                <Text style={styles.searchText}>SEARCH</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Input
                placeholder="Product Name"
                style={styles.SearchProduct}
                onFocus={() => setShowAutoComplete(true)}
                ref={productSearchRef}
                onBlur={() => {
                  setTimeout(() => setShowAutoComplete(false), 1000);
                }}
                onChangeText={val => {
                  setProductName(val);
                }}
                accessoryRight={<ClearSearchButton />}
                value={productName}
              />

              {filteredData && showAutoComplete ? (
                <ScrollView style={styles.AutocompleteArea}>
                  {filteredData
                    .filter(el =>
                      String(el)
                        .toLowerCase()
                        .includes(productName.toLowerCase()),
                    )
                    .map(el => (
                      <TouchableOpacity
                        key={el}
                        onPress={() => onSelect(el)}
                        style={styles.AutocompleteItem}>
                        <Text category="s1">{el}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
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
    paddingHorizontal: 10,
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
    width: '95%',
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
