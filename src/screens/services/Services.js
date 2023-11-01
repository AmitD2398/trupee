import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, Card, Paragraph, Title} from 'react-native-paper';
import MemberPlan from './MemberPlan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleHeader from '../../components/SimpleHeader';
import axiosConfig from '../../../axiosConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import {clockRunning} from 'react-native-reanimated';

const backgroundColors = [
  '#b3d4a5',
  '#f6baa0',
  '#ffdb99',
  '#adc9e8',
  '#EC7063',
  '#5D6D7E',
];
const Services = ({navigation}) => {
  const [user, setUser] = useState({});
  const [plan, setPlan] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [packnames, setPacknames] = useState('');
  const [discPrice, setDiscPrice] = useState('');
  const [wallet, setWallet] = useState({});
  const [paymentId, setPaymentId] = useState();
  const [storeddata, setStoreddata] = useState('');

  //<===================== StorePlan id in Localstorage========>

  const _storeData = async planId => {
    try {
      await AsyncStorage.setItem('plan', planId);
      console.log('plan Saved');
    } catch (error) {
      console.log('Some error in setting Plan');
    }
  };

  useEffect(() => {
    //getData();
    getPlan();
    getWallet();
    getUser();
  }, [storeddata]);

  //<==========================Get User Api===========>
  const getUser = async () => {
    axios
      .get(`http://62.72.58.41:5000/user/viewoneuser`, {
        headers: {'auth-token': await AsyncStorage.getItem('auth-token')},
      })
      .then(response => {
        console.log(response.data.data);
        setUser(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  // Get API =====================>

  const getPlan = async () => {
    axiosConfig
      .get(`/plan_list`)
      .then(response => {
        //console.log(response.data.data);
        setPlan(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  //Wallet Api
  const getWallet = async () => {
    axios
      .get(`http://62.72.58.41:5000/user/myWallet`, {
        headers: {
          'auth-token': await AsyncStorage.getItem('auth-token'),
        },
      })
      .then(response => {
        //console.log('wallet', response.data.data);
        const data = response.data.data;
        setWallet(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //<============Add free plan api===========>
  const freePlan = async () => {
    console.log(selectedItem);
    axios
      .post(
        `http://62.72.58.41:5000/user/freeMembership`,
        {
          planId: selectedItem,
          type: 'Free',
        },
        {
          headers: {
            'auth-token': await AsyncStorage.getItem('auth-token'),
          },
        },
      )
      .then(response => {
        console.log(response.data.data.planId);
        if (response.data.data.planId != null) {
          _storeData(response.data.data.planId);
        }
        if (response.data.message === 'success') {
          Alert.alert('Free MemberShip Successful');
          navigation.replace('Home');
        }
      })
      .catch(error => {
        console.log(error.response.data.message);
        if (error.response.data.message === 'already exists') {
          Alert.alert('Plan Already Exist');
        }
      });
  };

  //<============Add Paid plan api===========>

  const paidPlan = async () => {
    console.log(selectedItem, JSON.parse(paymentId));
    axios
      .post(
        `http://62.72.58.41:5000/user/addMemeberShip`,
        {
          planId: selectedItem,
          razorpay_payment_id: JSON.parse(paymentId),
        },
        {
          headers: {
            'auth-token': await AsyncStorage.getItem('auth-token'),
          },
        },
      )
      .then(response => {
        console.log(response.data);
        if (response.data.message === 'success') {
          Alert.alert('Membership Activated');
        }
        console.log(response.data.data.planId);
        if (response.data.data.planId != null) {
          _storeData(response.data.data.planId);
          navigation.replace('Home');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  //=======Apply Code Post Api ==========>
  const subscribe = async () => {
    if (discPrice !== 0) {
      var options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_rUafkCJLwIeF1t', // Your api key
        amount: (discPrice - wallet.amount) * 100,
        name: wallet?.firstname,
        prefill: {
          email: 'demo@demo.com',
          contact: wallet?.mobile,
          name: wallet?.firstname,
        },
        theme: {color: '#F37254'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          setPaymentId(JSON.stringify(data.razorpay_payment_id));
          console.log(paymentId);
          if (paymentId != '' && paymentId != null && paymentId != undefined) {
            paidPlan();
          } else {
            Alert.alert('Payment Failed');
          }
        })
        .catch(error => {
          console.log(error);
          Alert.alert('Your Transation was Unsuccessful');
        });
    } else {
      freePlan();
      //navigation.replace('Home');
    }
  };

  //Add Plans

  //Selected ID AMOUNT NAME================>

  const handleSelection = (_id, pack_name, des_price) => {
    var selectedId = _id;
    var packName = pack_name;
    var discAmount = des_price;

    if (selectedId === _id) setSelectedItem(_id);
    else setSelectedItem(null);
    console.log(_id);
    if (packName != '' || packName != null) {
      setPacknames(pack_name);
    } else null;
    console.log(pack_name);
    if (discAmount != '' || discAmount != null) {
      setDiscPrice(des_price);
    } else null;
    console.log(des_price);
  };

  return (
    <ImageBackground
      source={require('../../Images/Background/bgImg.png')}
      style={styles.container}>
      <View>
        <SimpleHeader />
      </View>
      <ScrollView>
        <View>
          <View style={styles.subView}>
            <Card style={styles.mainCard}>
              <Card.Content>
                <Paragraph>
                  Subscription Type : {user.planId?.pack_name}
                </Paragraph>
                <Paragraph>Start Date : {user?.start_date}</Paragraph>
                <Paragraph>Expiry Date : {user?.expdate}</Paragraph>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.subView}>
            {/* <MemberPlan /> */}
            <View>
              <View style={styles.textView}>
                <Text style={styles.oneText}>
                  Select Package to Activate Service
                </Text>
              </View>
              <View style={styles.textView}>
                <ScrollView horizontal={true}>
                  {plan?.map((item, index) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() =>
                        handleSelection(
                          item._id,
                          item.pack_name,
                          item.des_price,
                        )
                      }
                      style={[
                        item._id === selectedItem ? styles.memberTouch : null,
                        {
                          borderColor:
                            item._id === selectedItem ? 'red' : 'transparent', // Change 'red' to the desired border color
                        },
                      ]}>
                      <View
                        style={[
                          styles.card,
                          {
                            backgroundColor:
                              backgroundColors[index % backgroundColors.length],
                          },
                        ]}>
                        <Text style={styles.textcard}>{item?.pack_name}</Text>
                        <Text style={styles.textcard}>₹{item?.des_price}</Text>
                        <Text style={styles.textcard1}>
                          ₹ {item?.mrp_price}
                        </Text>
                        <Text style={styles.offText}>{item?.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
          <View style={styles.subView}>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              onPress={() => navigation.navigate('Premium Service')}>
              <View style={styles.viewOne}>
                <Text style={{fontWeight: '700', color: 'black'}}>
                  Premium / Paid Services Included:
                </Text>
              </View>
              <View style={styles.viewTwo}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color={'black'}
                  style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.subView}>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              onPress={() => navigation.navigate('Frequently Asked Questions')}>
              <View style={styles.viewOne}>
                <Text style={{fontWeight: '700', color: 'black'}}>
                  FAQs (Frequently asked Questions)
                </Text>
              </View>
              <View style={styles.viewOne}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color={'black'}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.subView}>
            <View style={styles.viewThree}>
              <Text style={{fontWeight: '700', color: 'black'}}>
                Referral Wallet Balance
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.viewThree}>
                <Text style={{fontWeight: '700', color: 'black', fontSize: 16}}>
                  ₹ {wallet?.amount}
                </Text>
              </View>
              <View style={styles.viewThree}>
                <Text style={{color: '#000'}}>Wallet Balance</Text>
                {/* <Text>Use My Wallet Balance</Text> */}
              </View>
            </View>
          </View>

          <View style={styles.subView}>
            <View style={styles.bottomStyle}>
              <Text style={[styles.viewThree, {color: '#000'}]}>
                I understand & agree to all of tradlogy’s
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Terms & Conditions')}>
                <Text style={[styles.viewThree, {color: '#000'}]}>
                  TERMS & CONDITIONS
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity style={styles.bottomBtn} onPress={subscribe}>
                  <Text style={styles.buttonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: '#c0d4a3',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 15,
  },
  subView: {
    width: '100%',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  viewOne: {
    marginHorizontal: 5,
    marginVertical: 20,
  },

  viewTwo: {
    marginHorizontal: 5,
    marginVertical: 20,
  },
  viewThree: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  viewFour: {
    marginHorizontal: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    width: 320,
  },
  buttonStyle: {
    backgroundColor: '#a82682',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  bottomStyle: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bottomBtn: {
    backgroundColor: '#a82682',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 10,
    elevation: 5,
  },
  //membership

  textView: {
    margin: 5,
  },
  oneText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  memberTouch: {
    borderWidth: 2,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    height: 140,
    width: 140,
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  textcard: {
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
  },
  textcard1: {
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
    textDecorationLine: 'line-through',
    textDecorationColor: '#000',
  },
  offText: {
    backgroundColor: '#a82682',
    color: '#fff',
    paddingHorizontal: 15,
    borderRadius: 20,
    textAlign: 'center',
  },
});
