import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {
  Icon,
  Text,
  Autocomplete,
  AutocompleteItem,
} from '@ui-kitten/components';
import {Searchbar, RadioButton} from 'react-native-paper';
import {getAllProducts, getPname} from '../database/realm';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import {useNavigation} from '@react-navigation/core';

const filter = (item, query) =>
  item.toLowerCase().includes(query.toLowerCase());

export default function Home(props) {
  //for search
  const [searchQuery, setSearchQuery] = useState(null);
  const [data, setData] = useState(getPname());
  const navigation = useNavigation();
  const [advancedSearchToggle, setAdvancedSearchToggle] = useState(false);

  const onCheckedChange = isChecked => {
    setAdvancedSearchToggle(isChecked);
  };

  const onSelect = index => {
    let code = getAllProducts()
      .filtered('pname==$0', data[index])
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

  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item} />
  );

  const renderCloseIcon = props => (
    <TouchableWithoutFeedback
      onPress={clearInput}
      disabled={searchQuery ? false : true}>
      <Icon {...props} name="close" />
    </TouchableWithoutFeedback>
  );

  const renderSearchIcon = props => (
    <TouchableWithoutFeedback
      onPress={handleSearchSubmit}
      disabled={searchQuery ? false : true}>
      <Icon {...props} name="search-outline" />
    </TouchableWithoutFeedback>
  );

  //for radiobutton to select search type:
  const [value, setValue] = React.useState('first');

  const handleSearchSubmit = () => {
    if (searchQuery) {
      props.navigation.push('Result', {searchQuery, value});
      setSearchQuery('');
      setData(getPname());
    }
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
        <ScrollView>
          {advancedSearchToggle ? (
            <View>
              <View style={styles.RectangleShapeView}>
                <Searchbar
                  placeholder="Product Name or Code"
                  value={searchQuery}
                  onChangeText={onChangeSearch}
                  onSubmitEditing={handleSearchSubmit}
                  onIconPress={handleSearchSubmit}
                  style={{marginHorizontal: 10, borderRadius: 25}}
                />
                <View style={styles.Rectangle2}>
                  <RadioButton.Group
                    onValueChange={newValue => setValue(newValue)}
                    value={value}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: '0%',
                        marginTop: 20,
                      }}>
                      <View style={styles.Rectangle3}>
                        <RadioButton
                          value="first"
                          styles={{
                            backgroundColor: '#E7E7E7',
                            borderRadius: 14,
                          }}></RadioButton>
                        <View style={{marginTop: '6%'}}>
                          <Text style={styles.text1}>Starts With</Text>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: 18}}></View>
                      <View style={styles.Rectangle3}>
                        <RadioButton
                          value="second"
                          styles={{
                            backgroundColor: '#E7E7E7',
                            borderRadius: 14,
                          }}
                        />
                        <View style={{marginTop: '6%'}}>
                          <Text style={styles.text1}>Contains</Text>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
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
              <Autocomplete
                placeholder="Product Name"
                value={searchQuery}
                size="large"
                accessoryRight={renderCloseIcon}
                accessoryLeft={renderSearchIcon}
                onChangeText={onChangeSearch}
                style={{
                  borderRadius: 25,
                  paddingHorizontal: 15,
                }}
                onSelect={onSelect}>
                {data.map(renderOption)}
              </Autocomplete>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  RectangleShapeView: {
    justifyContent: 'space-evenly',
    position: 'relative',
    marginLeft: 10,
    width: wp('93%'),
    height: hp('20%'),
    backgroundColor: '#F5E5DA',
    borderRadius: 20,
    flex: 1,
  },
  Rectangle2: {
    position: 'relative',
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
