import React from 'react';
import {Text, View} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider, useAuth} from '../services/context/auth';

import RNBootSplash from 'react-native-bootsplash';
import {Loading} from '../components/common/Loader';

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const {authData, loading} = useAuth();
  if (loading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!authData ? (
        <Stack.Screen component={AuthStack} name="AuthStack" />
      ) : (
        <Stack.Screen component={AppStack} name="AppStack" />
      )}
    </Stack.Navigator>
  );
};

const Router = () => {
  return (
    <AuthProvider>
      <NavigationContainer onReady={() => RNBootSplash.hide()}>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default Router;
