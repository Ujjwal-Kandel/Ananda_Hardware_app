import React from 'react';
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
        options={{headerTitle: () => <Text category="h4">Login</Text>}}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
