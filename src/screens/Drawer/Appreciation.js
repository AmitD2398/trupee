import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Appreciation = () => {
  const [paymentId, setPaymentId] = useState('');
  const [money, setMoney] = useState();
  const [desc, setDesc] = useState('');

  const success = async () => {
    console.log(money, desc, paymentId);
    axios
      .post(
        `https://crm.tradlogy.com/user/add_appriciation`,
        {
          amt: money,
          desc: desc,
          razorpay_payment_id: paymentId,
        },
        {
          headers: {
            'auth-token': await AsyncStorage.getItem('auth-token'),
          },
        },
      )
      .then(response => {
        console.log(response.data.data);
        setMoney('');
        setDesc('');
        setPaymentId('');
        Alert.alert('Thankyou For Appriciation..❤');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const tradlogy = () => {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_rUafkCJLwIeF1t',
      amount: money * 100,
      name: 'Pranay',
      prefill: {
        email: 'void@razorpay.com',
        contact: '9191919191',
        name: 'Razorpay Software',
      },
      theme: {color: '#F37254'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        //console.log(data.razorpay_payment_id);
        const pData = JSON.stringify(data.razorpay_payment_id);
        //console.log('InJson', pData);
        const payId = pData;
        setPaymentId(payId);
        //console.log('@@@', payId);

        if (data.razorpay_payment_id !== '') {
          success();
        }
        //alert(`${data.razorpay_payment_id}`);
      })
      .catch(error => {
        // handle failure
        Alert.alert('Your Transation was Unsuccessful');
        // alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainView}>
          <View style={styles.subView}>
            <View style={styles.imageView}>
              <Image
                source={require('../../Images/WhatsApp.jpeg')}
                style={styles.imageGraph}
              />
            </View>
            <View style={styles.textView}>
              <View>
                <Text style={styles.headText}>
                  How do we utilize the appreciation amountsend by users ?
                </Text>
              </View>
              <View style={styles.spaceView}>
                <Text style={styles.SimpleText}>
                  tradlogy has a commitment to help needy-poor-orphan people by
                  your donation, a token of appreciation or Corporate Social
                  Responsibility towards our society.
                </Text>
              </View>
              <View style={styles.spaceView}>
                <Text style={styles.SimpleText}>
                  All the contribution shared by you are forwarded to NGO to
                  help needy people. We have associated with SWRNA RAJHANS
                  STUDENTS WELFARE SOCIETY. Visit:
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'https://swrnarajhanscharitabletrust.org/',
                      );
                    }}>
                    <Text style={{color: 'blue', fontSize: 13}}>
                      https://swrnarajhanscharitabletrust.org/
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
              <View style={styles.spaceView}>
                <Text style={styles.SimpleText}>
                  If you would like to help us on our mission, do share your
                  token of love❤
                </Text>
              </View>
              <View style={styles.spaceView}>
                <Text style={styles.SimpleText}>
                  Fill the amount you wish to contribute to our team
                </Text>
              </View>
              <View style={styles.spaceView}>
                <TextInput
                  label="Amount"
                  mode="outlined"
                  value={money}
                  onChangeText={setMoney}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.spaceView}>
                <TextInput
                  label="We would love to hear from you"
                  mode="outlined"
                  value={desc}
                  onChangeText={setDesc}
                  multiline={true}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity style={styles.bottomButton} onPress={tradlogy}>
          <Text style={styles.buttonText}>SEND</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Appreciation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  mainView: {},
  subView: {
    margin: 18,
    backgroundColor: '#fff',
  },
  imageView: {alignItems: 'center'},
  imageGraph: {
    width: '80%',
    height: 250,
  },
  textView: {
    margin: 2,
  },

  headText: {
    color: 'blue',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 5,
  },
  spaceView: {marginVertical: 3},
  SimpleText: {
    color: '#000',
    fontSize: 12,
    lineHeight: 20,
  },
  bottomButton: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
