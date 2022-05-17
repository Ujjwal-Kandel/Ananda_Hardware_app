import React from 'react';

import {Text, useTheme} from '@ui-kitten/components';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Browse from '../CompaniesScreen';
import {CompanyCategories} from '../CategoriesScreen';
import {Products} from '../CompanyProductsScreen';
import Cart from '../../components/CartScreen/Cart';

const BrowseStack = createNativeStackNavigator();

function BrowseStackScreen() {
  const theme = useTheme();
  return (
    <BrowseStack.Navigator
      initialRouteName="Browse Companies"
      screenOptions={{
        headerRight: () => (
          <>
            <Cart />
          </>
        ),
      }}>
      <BrowseStack.Screen
        component={Browse}
        options={{
          headerTitle: () => <Text category="h5">Browse Companies</Text>,
        }}
        name="Browse Companies"
      />
      <BrowseStack.Screen
        component={CompanyCategories}
        name="Categories"
        options={{
          headerTitle: () => <Text category="h5">Categories</Text>,
        }}
      />
      <BrowseStack.Screen
        component={Products}
        name="Products"
        options={{
          headerTitle: () => <Text category="h5">Products</Text>,
        }}
      />
    </BrowseStack.Navigator>
  );
}

export default BrowseStackScreen;
