import {Button, Icon, Input, Text} from '@ui-kitten/components';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
} from 'react-native';
import WideButton from '../../components/common/WideButton';
import {useAuth} from '../../services/context/auth';

import AnandaHardwareLogo from '../../assets/original_icon.png';

function LoginScreen({navigation, route}) {
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const {signIn} = useAuth();

  // show or hide password
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    return () => {
      setIsLoading(false);
      setSignInData({});
    };
  }, []);
  // toggle secure text entry property
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={!secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );
  const handleLoginSubmit = async () => {
    if (!signInData.email && !signInData.password) {
      return;
    }
    setIsLoading(true);
    try {
      await signIn(signInData);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert(
        'Login Failed',
        error ? (error.message ? error.message : error) : 'Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          pointerEvents="auto"
          style={[styles.container, styles.KeyboardAvoidingViewWrapper]}>
          <Image
            source={AnandaHardwareLogo}
            style={{height: 200, width: 200}}
          />
          <View style={styles.dividor} />
          <View style={styles.authForm}>
            <Input
              style={styles.inputField}
              placeholder="Username"
              value={signInData.email}
              onChangeText={val => setSignInData({...signInData, email: val})}
            />
            <Input
              style={styles.inputField}
              placeholder="Password"
              secureTextEntry={secureTextEntry}
              value={signInData.password}
              onChangeText={val =>
                setSignInData({...signInData, password: val})
              }
              accessoryRight={renderIcon}
            />
            <View style={styles.submitWrapper}>
              <WideButton
                onPress={handleLoginSubmit}
                text="Login"
                size="small"
                accessoryRight={<Icon name="log-in-outline" />}
                isSubmitting={isLoading}
                disabled={
                  isLoading ? true : !(signInData.email && signInData.password)
                }
                isLoading={isLoading}
              />
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
    justifyContent: 'flex-start',
  },
  KeyboardAvoidingViewWrapper: {
    width: '100%',
  },
  dividor: {
    paddingTop: 5,
  },
  authForm: {
    width: '90%',
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
