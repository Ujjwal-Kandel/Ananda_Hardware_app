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
  Text,
} from '@ui-kitten/components';
// component
import Cart from '../components/CartScreen/Cart';
import ResultComponent from '../screens/ResultScreen';
import {Products} from '../screens/CompanyProductsScreen';
import {CompanyCategories} from '../screens/CategoriesScreen';
import {getAllProducts} from '../database/realm';
// screen
import {DetailScreen} from '../screens/DetailScreen';
import Home from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SearchRes from '../screens/SearchResultScreen';
import ScanScreen from '../screens/ScanScreen';
import Browse from '../screens/CompaniesScreen';
import Sync from '../screens/SyncScreen';
import BrowseStackScreen from '../screens/BrowseStackScreen';

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
      <Tab.Screen
        options={{
          headerTitle: () => <Text category="h6">Home</Text>,
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen
        name="BrowseStackScreen"
        options={{headerShown: false}}
        component={BrowseStackScreen}
      />
      <Tab.Screen name="Settings" component={Sync} />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerRight: () => <Cart />,
      }}>
      <Stack.Screen name="Result" component={SearchRes} />
      <Stack.Screen
        options={{headerShown: false}}
        name="Tabs"
        component={TabNavigator}
      />
      <Stack.Screen name="Search Result" component={ResultComponent} />
      <Stack.Screen name="Details" component={DetailScreen} />
      {/* <Stack.Screen component={Products} name="Products" /> */}
      {/* <Stack.Screen name="Categories" component={CompanyCategories} /> */}
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
