import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import CartList from '../components/CartScreen/CartList';

const CartScreen = () => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <CartList />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
