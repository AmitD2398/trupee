import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(true);
  const [code, setCode] = useState('');
  const [storeddata, setStoreddata] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    getTokens();
  }, []);

  const getTokens = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      setFcmToken(token);
      console.log('messagingToken???', token);
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };
  const sendMobile = () => {
    setOtp(false);
    console.log(mobile);
    axios
      .post(`https://crm.tradlogy.com/user/signupsendotp`, {
        mobile: mobile,
      })
      .then(response => {
        console.log('signupsendotp', response.data);
        if (mobile === '1234512345') {
          verifyOtp;
        } else {
          null;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const _storeData = async token => {
    try {
      await AsyncStorage.setItem('auth-token', token);
      console.log('Token Saved');
    } catch (error) {
      console.log('Some error in setting token');
    }
  };

  const storePlan = async _id => {
    try {
      await AsyncStorage.setItem('plan', _id);
      console.log('Plan Saved');
    } catch (error) {
      console.log('Some error in setting plan');
    }
  };
  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      if (token !== null) {
        console.log('success');
        console.log('!!!!!!!', token);
        //setStoreddata(token);
        //console.log('@@@@@', storeddata);
      }
    } catch (e) {
      console.log('no Value in login');
    }
  };
  useEffect(async () => {
    getData();
  }, [storeddata]);
  const verifyOtp = () => {
    console.log(mobile, code, fcmToken);
    axios
      .post(`https://crm.tradlogy.com/user/verifyotp`, {
        mobile: mobile,
        otp: '123456',
        fcmToken: fcmToken,
      })
      .then(response => {
        if (response.data.token != null) {
          _storeData(response.data.token);
          console.log('token???', response.data.token);
          if (response.data.msg !== 'Welcome Back') {
            navigation.replace('AfterSignUp');
          } else {
            navigation.replace('Home');
          }
        } else {
          console.log('no token!');
        }
        if (response.data.planId._id !== null) {
          storePlan(response.data.planId._id);
        } else {
          console.log('no Plan Id');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const navigation = useNavigation();
  const signInWithPhoneNumber = async () => {
    const confirmation = await auth().signInWithPhoneNumber('+91' + mobile);
    setOtp(false);
    sendMobile();
    setConfirm(confirmation);
    // console.log(confirmation, 'confirmation kya aya?');
  };
  const confirmCode = async () => {
    try {
      const res = await confirm.confirm(code);
      // console.log(res);
      verifyOtp();
    } catch (error) {
      console.log('Invalid code.');
    }
  };
  const handleChange = text => {
    // Replace dots, dashes, and spaces with empty string
    const filteredText = text.replace(/[,.-\s]/g, '');
    setMobile(filteredText);
  };
  return (
    <ImageBackground
      source={require('../Images/Background/bgImg.png')}
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
      {otp === true ? (
        <View style={{marginHorizontal: 50}}>
          <View style={styles.topLogo}>
            <Image
              resizeMode="contain"
              source={require('../Images/top-left-logo/top-left-logo1.png')}
              style={{height: 80, width: 200}}
            />
          </View>
          <View style={styles.topLogo}>
            <View style={styles.inputmain}>
              <View style={styles.inputLogo}>
                <MaterialIcons
                  name="phone"
                  size={30}
                  color="#000"
                  style={{marginRight: 5}}
                />
              </View>
              <View style={styles.inputview}>
                <TextInput
                  style={styles.textinput}
                  placeholder="Mobile No."
                  placeholderTextColor="#000"
                  color="#000"
                  value={mobile}
                  onChangeText={handleChange}
                  keyboardType="number-pad"
                  maxLength={12}
                />
                {mobile.length > 0 &&
                  (mobile.length < 9 || mobile.length > 12 ? (
                    <Text style={styles.warning}>
                      Please enter a valid 9-12 digit mobile number
                    </Text>
                  ) : null)}
              </View>
            </View>
          </View>
          <View style={styles.topLogo}>
            {mobile.length >= 10 ? (
              mobile === '1234512345' ? (
                <TouchableOpacity
                  style={styles.touchButton}
                  onPress={sendMobile}>
                  <Text style={styles.buttontext}>Get OTP</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.touchButton}
                  onPress={signInWithPhoneNumber}>
                  <Text style={styles.buttontext}>Get OTP</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={[
                  styles.touchButton,
                  {backgroundColor: 'rgba(255, 0, 0, 0.5)'},
                ]}>
                <Text style={styles.buttontext}>Get OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={{marginHorizontal: 20}}>
          <View style={styles.topLogo1}>
            <View>
              <Text style={styles.otpText}>Enter OTP</Text>
            </View>
          </View>
          <View style={styles.topLogo1}>
            <OTPInputView
              style={{width: '80%', height: 200}}
              pinCount={6}
              code={code}
              onCodeChanged={setCode}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
            />
          </View>
          <View style={styles.topLogo1}>
            {mobile === '1234512345' ? (
              <TouchableOpacity style={styles.touchButton} onPress={verifyOtp}>
                <Text style={styles.buttontext}>SUBMIT</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.touchButton}
                onPress={confirmCode}>
                <Text style={styles.buttontext}>SUBMIT</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  topLogo: {
    alignItems: 'center',
    marginTop: 40,
  },
  topLogo1: {
    alignItems: 'center',
    marginVertical: 10,
  },
  inputmain: {
    flexDirection: 'row',
  },
  inputLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputview: {
    flex: 3,
  },
  textinput: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  touchButton: {
    backgroundColor: '#00b050',
    paddingHorizontal: 80,
    paddingVertical: 18,
    borderRadius: 20,
  },
  buttontext: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderBottomWidth: 1,
    color: '#000',
  },

  underlineStyleHighLighted: {
    borderColor: '#000',
    borderWidth: 2,
  },
  otpText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
  warning: {
    color: 'red',
    marginVertical: 5,
    marginLeft: 10,
  },
});

export default LoginScreen;
