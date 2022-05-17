import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '../services/context/auth';
import axios from '../services/httpService';

import RNBootSplash from 'react-native-bootsplash';
import {Loading} from '../components/common/Loader';

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const {authData, loading, signOut} = useAuth();

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        console.log({error});
        if (error.response.status == 401) {
          signOut();
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

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
    <NavigationContainer onReady={() => RNBootSplash.hide()}>
      <RootStack />
    </NavigationContainer>
  );
};

export default Router;
