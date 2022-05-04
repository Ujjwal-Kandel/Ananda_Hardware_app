import React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Text} from '@ui-kitten/components';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {backgroundColor: '#fff'},
      }}
      initialRouteName="Login">
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerTitle: 'Welcome'}}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
