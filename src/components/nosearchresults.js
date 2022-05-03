import React from 'react';
import {Text, ImageBackground, StyleSheet} from 'react-native';

export const NoSearchResults = () => {
  return (
    <ImageBackground
      source={require('../img/noresultsfound.jpg')}
      style={styles.imagebackground}
      resizeMethod="resize"
      resizeMode="cover">
      <Text style={styles.text}>No Data Found</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
  },
  imagebackground: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});