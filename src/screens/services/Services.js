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
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, Card, Paragraph, Title} from 'react-native-paper';
import MemberPlan from './MemberPlan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleHeader from '../../components/SimpleHeader';
import axiosConfig from '../../../axiosConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clockRunning} from 'react-native-reanimated';
import {CheckBox} from 'react-native-elements';
import Webview from '../../components/Webview';

const backgroundColors = [
  '#b3d4a5',
  '#f6baa0',
  '#ffdb99',
  '#adc9e8',
  '#EC7063',
  '#5D6D7E',
];
const Services = ({navigation, route}) => {
  const {payment_final_id} = route.params ?? {};
  console.log('payment_final_id', payment_final_id?.payment_request?.id);
  {payment_final_id?.payment_request?.id ?
    paidPlan()
    :
    null
  }
  const [user, setUser] = useState({});
  const [plan, setPlan] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [packnames, setPacknames] = useState('');
  const [discPrice, setDiscPrice] = useState('');
  const [wallet, setWallet] = useState({});
  const [paymentId, setPaymentId] = useState();
  const [storeddata, setStoreddata] = useState('');
  const [checkBoxValue, setCheckBoxValue] = useState('');
  const [loading, setLoading] = useState(false);
  console.log('selectedItem', selectedItem);
  const handleCheckBoxPress = () => {
    // Check if the amount is lower than 10 rupees
    if (wallet?.amount < 10) {
      // Display an error message or perform some other action
      console.error('Error: Insufficient Wallet Points, Minimum  10');
    } else {
      // Proceed with the CheckBox action
      setCheckBoxValue(!checkBoxValue);
    }
  };

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
      .get(`https://crm.tradlogy.com/user/viewoneuser`, {
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
      .get(`https://crm.tradlogy.com/user/myWallet`, {
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
        `https://crm.tradlogy.com/user/freeMembership`,
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
    console.log('selectedItem???', selectedItem, payment_final_id?.payment_request?.id);
    axios
      .post(
        `https://crm.tradlogy.com/user/addMemeberShip`,
        {
          planId: selectedItem,
          razorpay_payment_id: payment_final_id?.payment_request?.id,
          payment_response:payment_final_id
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
      try {
        const requestBody = {
          purpose: 'Your Payment Purpose',
          amount: discPrice - wallet.amount,
          buyer_name: wallet?.firstname,
          redirect_url: 'http://www.example.com',
          send_email: false,
          allow_repeated_payments: false,
        };

        console.log('Request Payload:', JSON.stringify(requestBody));

        const response = await axios.post(
          'https://www.instamojo.com/api/1.1/payment-requests/',
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': 'b7582c5b8e16d99a6b1fd165c15a0dbe',
              'X-Auth-Token': '623440849b453f66fcc352780111efc6',
            },
          },
        );

        // Log the entire response for debugging purposes
        console.log('Response:', response.data);

        // Redirect the user to the payment URL
        const paymentURL = response.data.payment_request.longurl;
        // Use React Navigation or Linking to open the paymentURL in a WebView or external browser
        navigation.navigate('Webview', {url: paymentURL, selectedItem});
        console.log(paymentURL);
      } catch (error) {
        console.error(
          'Error initiating payment:',
          error.response ? error.response.data : error.message,
        );
      }
    } else {
      freePlan();
      // navigation.replace('Home');
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
          <View style={styles.textView}>
            <Text style={styles.oneText}>Current plan</Text>
          </View>
          <View style={styles.subView}>
            <Card style={styles.mainCard}>
              {user?.is_paid == '0' ? (
                <Card.Content>
                  <Paragraph>Subscription Type : {user?.pack_name}</Paragraph>
                  {user?.is_paid == 0 ? null : (
                    <>
                      <Paragraph>Start Date : {user?.start_date}</Paragraph>
                      <Paragraph>Expiry Date : {user?.expdate}</Paragraph>
                    </>
                  )}
                </Card.Content>
              ) : user?.is_paid == '1' ? (
                <Card.Content>
                  <Paragraph>Subscription Type :{user?.pack_name}</Paragraph>
                  {user?.is_paid == 0 ? null : (
                    <>
                      <Paragraph>Start Date : {user?.start_date}</Paragraph>
                      <Paragraph>Expiry Date : {user?.expdate}</Paragraph>
                    </>
                  )}
                </Card.Content>
              ) : user?.is_paid == '2' ? (
                <Card.Content>
                  <Paragraph>Subscription Type :{user?.pack_name}</Paragraph>
                  {user?.is_paid == 0 ? null : (
                    <>
                      <Paragraph>Start Date : {user?.start_date}</Paragraph>
                      <Paragraph>Expiry Date : {user?.expdate}</Paragraph>
                    </>
                  )}
                </Card.Content>
              ) : user?.is_paid == '3' ? (
                <Card.Content>
                  <Paragraph>Subscription Type :{user?.pack_name}</Paragraph>
                  {user?.is_paid == 0 ? null : (
                    <>
                      <Paragraph>Start Date : {user?.start_date}</Paragraph>
                      <Paragraph>Expiry Date : {user?.expdate}</Paragraph>
                    </>
                  )}
                </Card.Content>
              ) : null}
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
                        <Text style={styles.textcard}>{item?.des_price}</Text>
                        <Text style={styles.textcard1}>
                           {item?.mrp_price}
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
                Referral Wallet Points
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.viewThree}>
                <Text style={{fontWeight: '700', color: 'black', fontSize: 16}}>
                   {wallet?.amount}
                </Text>
              </View>
              <View style={[styles.viewThree, {flexDirection: 'row'}]}>
                <Text style={{color: '#000'}}>Wallet Points</Text>
                <View>
                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      width: '100%',
                      backgroundColor: 'transparent', // Set background color to transparent
                      borderRadius: 0, // Set border radius to 0
                      padding: 0, // Align the title from right to left
                    }}
                    checked={checkBoxValue}
                    onPress={handleCheckBoxPress}
                  />
                </View>
                {/* <Text>Use My Wallet Points</Text> */}
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
