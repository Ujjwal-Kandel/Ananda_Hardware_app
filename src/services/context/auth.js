import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {authService} from '../authService';
import {setAuthToken} from '../httpService';

const AuthContext = createContext();

function AuthProvider({children}) {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  const parseJwt = token => {
    const {Buffer} = require('buffer/');
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  };

  const loadStorageData = useCallback(async () => {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData = JSON.parse(authDataSerialized);
        const decodedJwt = await parseJwt(_authData.token);
        if (decodedJwt.exp * 1000 < Date.now()) {
          await signOut();
        } else {
          setAuthData(_authData);
          setAuthToken(_authData.token);
        }
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async ({email, password}) => {
    try {
      const {data, message, status, success} = await authService.signIn({
        email,
        password,
      });

      const {token, user} = data;
      const _authData = {
        token,
        user,
        message,
        status,
        success,
      };
      if (token) {
        await AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));
        // setting the token in axios instance
        setAuthToken(token);
        setAuthData(_authData);
      }
    } catch (error) {
      console.log(JSON.stringify(error), 'errorrrrrrr');
      if (error.response && error.response.message) {
        throw new Error(error.response.data.message);
      }
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Please check your internet connection and try again.');
    }
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem('@AuthData');
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export {AuthContext, AuthProvider, useAuth};
