import React from 'react';

import {useTheme} from '@ui-kitten/components';
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
      <BrowseStack.Screen component={Browse} name="Browse Companies" />
      <BrowseStack.Screen component={CompanyCategories} name="Categories" />
      <BrowseStack.Screen component={Products} name="Products" />
    </BrowseStack.Navigator>
  );
}

export default BrowseStackScreen;
