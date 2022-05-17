import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import React from 'react';
import {Text, useTheme} from '@ui-kitten/components';
import {capitalize} from 'lodash';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import TextMarquee from 'react-native-marquee';

const {width} = Dimensions.get('window');

import defaultImage from '../../assets/original_icon.png';

function GridItem({item, onPress}) {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.stockStatusIndicator(theme, item.stock <= 5)} />
      <Image
        style={styles.gridImage}
        source={{uri: item.image[0]}}
        defaultSource={defaultImage}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingHorizontal: '5%',
          width: '100%',
        }}>
        <View
          style={{
            borderTopWidth: 0.5,
            width: '100%',
            borderColor: '#ccc',
          }}
        />
        <View>
          <TextMarquee
            style={{color: '#000', fontFamily: 'Raleway-Regular'}}
            loop={true}
            speed={1}
            delay={1000}
            marqueeOnStart={true}>
            {capitalize(item.pname)}
          </TextMarquee>
          <Text category={'c1'} adjustsFontSizeToFit>
            Rs: {item.price}
          </Text>
          <Text category={'c1'} adjustsFontSizeToFit>
            Code: {item.code}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default GridItem;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    aspectRatio: 1,
    maxWidth: '50%',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: '#ccc',
    margin: 1,
  },
  gridImage: {
    resizeMode: 'contain',
    width: width / 2,
    flex: PixelRatio.get() <= 4 ? 2.5 : 5,
  },
  namecode: {
    fontFamily: 'Lato-Regular',
    color: '#191919',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
    width: wp('100%'),
  },
  stockStatusIndicator: (theme, lowStock) => ({
    height: 3,
    backgroundColor: lowStock
      ? theme['color-danger-default']
      : theme['color-success-default'],
    width: '100%',
  }),
});
