import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React from 'react';
import {Card, Divider} from '@ui-kitten/components';
import TextTicker from 'react-native-text-ticker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

function GridItem({item, onPress}) {
  const navigation = useNavigation();
  return (
    <Card
      onPress={onPress}
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
}

export default GridItem;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
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
});
