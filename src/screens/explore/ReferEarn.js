import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Share from 'react-native-share';

const ReferEarn = () => {
  const [user, setUser] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString(user.refral_Code);
    showToast();
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  const showToast = () => {
    ToastAndroid.show('Text Copied', ToastAndroid.LONG);
  };

  const shareOptions = {
    title: 'Share via',
    message: `New Trading Tip App for you with Best Features I Am Sharing my Refferal Code ${user?.refral_Code}`,
  };
  const onShare = async () => {
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  //get User Api for name
  const getUser = async () => {
    axios
      .get(`https://crm.tradlogy.com/user/viewoneuser`, {
        headers: {
          'auth-token': await AsyncStorage.getItem('auth-token'),
        },
      })
      .then(response => {
        console.log('name', response.data.data);
        const user = response.data.data;
        setUser(user);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.subView}>
          <Image
            source={require('../../Images/Icons/top-calander-colour-icon1.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.subView}>
          <Text style={styles.headText}>
            Refer your friends and earn lifetime 5% on the premium package they
            apply for
          </Text>
        </View>
        <View style={styles.subView}>
          <Text style={styles.subText}>
            Earn 5% commission everytime your referal purchase a premium plan
          </Text>
          <Text style={styles.subText}>
            Withdraw earnings directly to your bank account
          </Text>
          <Text style={styles.subText}>
            Your Friend can get 10% instant discount by using your refferal-ID
            for their 1st premium plan. T&C Applied
          </Text>
          <Text style={styles.referText}>{user?.refral_Code}</Text>
        </View>
        <View style={styles.subView}>
          <TouchableOpacity style={styles.btnDesign} onPress={copyToClipboard}>
            <Text style={styles.touchText}>COPY</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subView}>
          <TouchableOpacity style={styles.btnDesign} onPress={onShare}>
            <Text style={styles.touchText}>SHARE</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subView}>
          <TouchableOpacity style={styles.btnDesign}>
            <Text style={styles.touchText}>VIEW REFFERAL HISTORY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReferEarn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 80,
    width: 100,
  },
  headText: {
    alignContent: 'center',
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  subText: {
    alignContent: 'center',
    color: '#000',
    fontSize: 10,
    fontWeight: '500',
    marginVertical: 5,
    textAlign: 'center',
  },
  referText: {
    alignContent: 'center',
    color: '#000',
    fontSize: 25,
    fontWeight: '500',
    marginVertical: 5,
    textAlign: 'center',
  },
  btnDesign: {
    backgroundColor: '#a82682',
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginVertical: 10,
    borderRadius: 10,
  },
  touchText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
