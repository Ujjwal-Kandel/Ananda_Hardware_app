// SHOWS THE RESULT FROM SEARCH

import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {getAllProducts} from '../database/realm';
import {
  useNavigation,
  useRoute,
  useNavigationState,
} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import {LogBox} from 'react-native';

import {Card, Icon, Modal, Text} from '@ui-kitten/components';
import AddToCart from '../components/DetailScreen/AddToCart';
import Orientation from '../components/common/Orientation';
import defaultImage from '../assets/original_icon.png';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export const DetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const previousRoute = useNavigationState(state => state.routes);
  const isMounted = useRef({
    code: '',
  });
  let props = route.params;

  const [orientation, setOrientation] = useState(
    Orientation.isPortrait() ? 'portrait' : 'landscape',
  );
  const [product, setProduct] = useState(
    getAllProducts().filtered('code==$0', props.code)[0],
  );

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setOrientation(Orientation.isPortrait() ? 'portrait' : 'landscape');
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({title: product.pname});
  }, [navigation, product.pname]);

  useEffect(() => {
    isMounted.current.code = props.code;
  }, [props]);

  useEffect(() => {
    setProduct(() => {
      return getAllProducts().filtered('code=$0', isMounted.current.code)[0];
    });
  }, [route]);

  const imageList = product.image;

  const renderImage = (item, index) => {
    return (
      <View
        key={index}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{uri: imageList[index]}}
          style={{height: '100%', width: '100%'}}
          resizeMode="contain"
          defaultSource={defaultImage}
        />
      </View>
    );
  };

  const RenderSwiper = () => {
    return (
      <Swiper
        showsButtons={false}
        width="100%"
        loop={false}
        backgroundColor="#fff"
        paginationStyle={{bottom: 10}}>
        {imageList.map(renderImage)}
      </Swiper>
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          flexDirection: orientation === 'portrait' ? 'column' : 'row',
        }}>
        <View style={{width: '100%', flex: 1}}>
          <RenderSwiper />
        </View>
        <View style={{paddingHorizontal: 10, paddingVertical: 10, flex: 1}}>
          <Text category="h5">{product.pname}</Text>
          <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
            <Text>- Code: {product.code}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Text>- Stock: </Text>
              <Text status={product.stock <= 5 ? 'danger' : 'success'}>
                {product.stock}
              </Text>
            </View>
            <Text>- Dimension: {product.dimension}</Text>
          </View>
          <View style={[styles.divider, {marginTop: 10}]} />
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text category={'h5'}>Price: </Text>
            <Text category={'h5'}>Rs. {product.price}</Text>
          </View>
        </View>
      </View>
      <AddToCart product={product} setIsModalVisible={setIsModalVisible} />
      <Modal visible={isModalVisible} backdropStyle={styles.backdrop}>
        <Card>
          <View style={{alignItems: 'center'}}>
            <Text category="h5">Added to Cart</Text>
            <Icon
              name={'checkmark-circle-outline'}
              style={styles.iconStyles}
              fill={'green'}
            />
          </View>
        </Card>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconStyles: {
    height: 32,
    width: 32,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: 'Lato-Regular',
    color: '#2b2b2b',
    fontWeight: '200',
    paddingHorizontal: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#8a8a8a',
    marginBottom: 10,
    opacity: 0.2,
  },
});
