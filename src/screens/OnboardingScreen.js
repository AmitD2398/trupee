import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import bgImg from '../Images/Background/bgImg.png';
import LoginScreen from './LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';

const OnboardingScreen = ({navigation}) => {
  const {height, width} = Dimensions.get('window');
  setTimeout(async () => {
    const value = await AsyncStorage.getItem('auth-token');
    if (value !== null) {
      navigation.replace('MemberPlan');
    } else {
      navigation.replace('Login');
      //navigation.replace('Login', {name: 'Login'});
    }
  }, 2000);
  return (
    <View style={styles.container}>
      <Image
        style={{width: width, height: height}}
        source={require('../Images/mainlogo/splashscreen.png')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: 200,
    height: 200,
  },
});

export default OnboardingScreen;
