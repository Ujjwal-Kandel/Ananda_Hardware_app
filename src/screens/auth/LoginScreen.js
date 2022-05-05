import {Button, Input, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useAuth} from '../../services/context/auth';

function LoginScreen({navigation, route}) {
  const [signInData, setSignInData] = useState({email: '', password: ''});
  const {signIn} = useAuth();

  const handleLoginSubmit = () => {
    if (!signInData.email && !signInData.password) {
      return;
    }
    console.log({signInData});
    signIn(signInData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          pointerEvents="auto"
          style={[styles.container, styles.KeyboardAvoidingViewWrapper]}>
          <View style={styles.dividor} />
          <Text style={styles.titleText}>Login</Text>
          <View style={styles.authForm}>
            <Input
              style={styles.inputField}
              placeholder="email"
              value={signInData.email}
              onChangeText={val => setSignInData({...signInData, email: val})}
            />
            <Input
              style={styles.inputField}
              placeholder="password"
              secureTextEntry
              value={signInData.password}
              onChangeText={val =>
                setSignInData({...signInData, password: val})
              }
            />
            <View style={styles.submitWrapper}>
              <Button
                onPress={handleLoginSubmit}
                disabled={!signInData.email || !signInData.password}>
                Submit
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  KeyboardAvoidingViewWrapper: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  dividor: {
    paddingTop: 5,
  },
  authForm: {
    flex: 1,
    width: '70%',
    marginTop: '30%',
  },
  inputField: {
    color: '#000',
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  titleText: {
    textTransform: 'uppercase',
    fontSize: 25,
    color: '#111',
    marginTop: 30,
    textAlignVertical: 'center',
  },
  submitWrapper: {
    marginTop: 10,
  },
});
