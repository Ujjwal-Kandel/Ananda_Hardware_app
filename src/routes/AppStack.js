import React from 'react';
// react native
import {StyleSheet, View} from 'react-native';
// react navigation
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// ui kitten
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
// component
import Cart from '../components/CartScreen/Cart';
import ResultComponent from '../screens/resultComponent';
import {DetailScreen} from '../components/detailScreen';
import {Products} from '../screens/companyProducts';
import {CompanyCategories} from '../screens/categories';
import CartScreen from '../screens/CartScreen';
import {getAllProducts} from '../database/realm';
import SearchRes from '../screens/searchRes';
// screen
import Home from '../screens/home';
import Browse from '../screens/browse';
import Sync from '../screens/sync';
import ScanScreen from '../screens/qr';

const Tab = createBottomTabNavigator();

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab
      title={evaProps => (
        <Icon name="search-outline" fill="#000" style={styles.icon} />
      )}
    />
    <BottomNavigationTab
      title={evaProps => (
        <Icon name="camera-outline" fill="#000" style={styles.icon} />
      )}
    />
    <BottomNavigationTab
      title={evaProps => (
        <Icon name="list-outline" style={styles.icon} fill="#000" />
      )}
    />
    <BottomNavigationTab
      title={evaProps => (
        <Icon name="settings-outline" style={styles.icon} fill="#000" />
      )}
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
          <View style={styles.headerRightIconStyles}>
            <Cart />
          </View>
        ),
      }}
      tabBar={props => <BottomTabBar {...props} />}
      initialRouteName={getAllProducts().length === 0 ? 'Settings' : 'home'}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Browse Companies" component={Browse} />
      <Tab.Screen name="Settings" component={Sync} />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  const Stack = createNativeStackNavigator();

  return (
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
      <Stack.Screen name="Search Result" component={ResultComponent} />
      <Stack.Screen name="Details" component={DetailScreen} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Categories" component={CompanyCategories} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{headerRight: () => null}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  headerRightIconStyles: {
    paddingRight: 15,
  },
  icon: {
    width: 30,
    height: 30,
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
