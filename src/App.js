import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import {
//   ApplicationProvider,
//   IconRegistry,
//   BottomNavigation,
//   BottomNavigationTab,
// } from '@ui-kitten/components';
// import {EvaIconsPack} from '@ui-kitten/eva-icons';
// import * as eva from '@eva-design/eva';
// import Icon from 'react-native-vector-icons/FontAwesome';

// import {Provider} from 'react-redux';

// import store from './store/store';

// import home from './screens/home';
// import sync from './screens/sync';
// import qr from './screens/qr';
// import browse from './screens/browse';
// import SearchRes from './screens/searchRes';
// import ResultComponent from './screens/resultComponent';
// import {DetailScreen} from './components/detailScreen';
// import {products} from './screens/companyProducts';
// import {companyCategories} from './screens/categories';
// import CartScreen from './screens/CartScreen';

// import Cart from './components/CartScreen/Cart';

// import {getAllProducts} from './database/realm';

const Tab = createBottomTabNavigator();

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab
      title={evaProps => <Icon name="search" size={30} color="#000" />}
    />
    <BottomNavigationTab
      title={evaProps => <Icon name="qrcode" size={30} color="#000" />}
    />
    <BottomNavigationTab
      title={evaProps => <Icon name="list" size={30} color="#000" />}
    />
    <BottomNavigationTab
      title={evaProps => <Icon name="gear" size={30} color="#000" />}
    />
  </BottomNavigation>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: 'red',
        inactiveTintColor: 'black',
        headerRight: () => (
          <View style={{paddingRight: 15}}>
            <Cart />
          </View>
        ),
      }}
      tabBar={props => <BottomTabBar {...props} />}
      initialRouteName={getAllProducts().length === 0 ? 'Settings' : 'home'}>
      <Tab.Screen name="Home" component={home} />
      <Tab.Screen name="Scan" component={qr} />
      <Tab.Screen name="Browse Companies" component={browse} />
      <Tab.Screen name="Settings" component={sync} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <Provider store={store}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="tabs"
                screenOptions={{
                  headerRight: () => <Cart />,
                }}>
                <Stack.Screen name="Result" component={SearchRes} />
                <Stack.Screen
                  options={{headerShown: false}}
                  name="tabs"
                  component={TabNavigator}
                />
                <Stack.Screen
                  name="Search Result"
                  component={ResultComponent}
                />
                <Stack.Screen name="Details" component={DetailScreen} />
                <Stack.Screen name="Products" component={products} />
                <Stack.Screen name="Categories" component={companyCategories} />
                <Stack.Screen
                  name="Cart"
                  component={CartScreen}
                  options={{headerRight: () => null}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ApplicationProvider>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
