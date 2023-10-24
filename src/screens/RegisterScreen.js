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
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(true);
  const [code, setCode] = useState('');
  const [storeddata, setStoreddata] = useState('');

  const sendMobile = () => {
    setOtp(false);
    console.log(mobile);
    axios
      .post(`http://62.72.58.41:5000/user/signupsendotp`, {
        mobile: mobile,
      })
      .then(response => {
        console.log(response.data);
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
  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      if (token !== null) {
        console.log('success');
        console.log(token);
        setStoreddata(token);
        navigation.replace('Home');
      }
    } catch (e) {
      console.log('no Value in login');
    }
  };
  useEffect(() => {
    getData();
  }, [storeddata]);
  const verifyOtp = () => {
    console.log(mobile, code);
    axios
      .post(`http://62.72.58.41:5000/user/verifyotp`, {
        mobile: mobile,
        otp: code,
      })
      .then(response => {
        console.log(response.data);
        if (response.data.token != null) {
          _storeData(response.data.token);
          navigation.replace('Home');
        } else {
          console.log('no token!');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
      {otp === true ? (
        <View style={{marginHorizontal: 50}}>
          <View style={styles.topLogo}>
            <Image
              source={require('../Images/mainlogo/mainLogo.png')}
              style={{height: 150, width: 150}}
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
                  onChangeText={setMobile}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
          <View style={styles.topLogo}>
            <TouchableOpacity style={styles.touchButton} onPress={sendMobile}>
              <Text style={styles.buttontext}>Get OTP</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.touchButton} onPress={verifyOtp}>
              <Text style={styles.buttontext}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  topLogo: {
    alignItems: 'center',
    marginVertical: 40,
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
});

export default RegisterScreen;
