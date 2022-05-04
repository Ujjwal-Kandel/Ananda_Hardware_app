import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider, useAuth} from '../auth/context/auth';

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const {authData} = useAuth();

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
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default Router;