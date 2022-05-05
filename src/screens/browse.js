import React, {useEffect, useState} from 'react';
import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import {Icon, Card, Input, Text, MenuItem} from '@ui-kitten/components';

import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {getAllCompany} from '../database/realm';
import {NoSearchResults} from '../components/nosearchresults';
import {useTheme} from '@ui-kitten/components';

const filter = (item, query) =>
  item.toLowerCase().startsWith(query.toLowerCase());

export default function Browse() {
  const navigation = useNavigation();
  const [value, setValue] = React.useState(null);
  const [data, setData] = React.useState(getAllCompany());

  useEffect(() => {
    navigation.addListener('focus', () => {
      setData(getAllCompany());
    });
  }, [navigation]);

  const onChangeText = query => {
    setValue(query);
    setData(getAllCompany().filter(item => filter(item.name, query)));
  };

  function CompanyListView() {
    const theme = useTheme();
    return (
      <View style={styles.rectangle40}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: hp('30%')}} />}
          renderItem={({item, index}) => {
            return (
              <MenuItem
                style={styles.card}
                onPress={() =>
                  navigation.navigate('Categories', {
                    companyName: item.name,
                  })
                }
                accessoryRight={() => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>{item.product_count}</Text>
                    <Icon
                      name="inbox-outline"
                      style={{width: 25, height: 25}}
                      fill={theme['color-primary-500']}
                    />
                  </View>
                )}
                title={() => <Text category="s1">{item.name}</Text>}
              />
            );
          }}
        />
      </View>
    );
  }

  // inbox-outline
  return (
    <SafeAreaView>
      <Input
        placeholder="Company name"
        value={value}
        onChangeText={onChangeText}
      />
      {data === 0 ? <NoSearchResults /> : <CompanyListView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 2,
    marginTop: '2%',
  },
  rectangle40: {
    position: 'relative',
    borderRadius: 15,
  },
});
