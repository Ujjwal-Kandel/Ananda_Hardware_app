import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// ui kitten
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import mapping from '../mapping.json';

// redux
import {Provider} from 'react-redux';
import store from './store/store';

// Stack
import Router from './routes/Router';
import {AuthProvider} from './services/context/auth';

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <AuthProvider>
        <Provider store={store}>
          <ApplicationProvider
            {...eva}
            theme={eva.light}
            customMapping={mapping}>
            <SafeAreaProvider>
              <Router />
            </SafeAreaProvider>
          </ApplicationProvider>
        </Provider>
      </AuthProvider>
    </>
  );
}
