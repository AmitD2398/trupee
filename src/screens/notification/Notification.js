import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListItem, Image} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import axiosConfig from '../../../axiosConfig';
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import Moment from 'react-moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import {styles} from './NotificationStyle';
import dings from '../../assets/notifySound.mpeg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import moment from 'moment';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

var ding = new Sound(dings, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // if loaded successfully
  console.log(
    'duration in seconds: ' +
      ding.getDuration() +
      'number of channels: ' +
      ding.getNumberOfChannels(),
  );
});

export default function Notification({navigation}) {
  const [notify, setNotify] = useState([]);
  const [imgNotify, setImgNotify] = useState([]);
  const [plImage, setPlImage] = useState(
    'https://api.adorable.io/avatars/80/abott@adorable.png',
  );
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayProfit, setTodayProfit] = useState({});
  const [weeklyProfit, setWeeklyProfit] = useState({});
  const [monthlyProfit, setMonthlyProfit] = useState({});
  const [expFreeMem, setExpFreeMem] = useState('');
  const {width} = useWindowDimensions();
  const tagsStyles = {
    p: {color: 'red'}, // Change color for all <p> tags to red
    a: {color: 'blue'}, // Change color for all <a> tags to blue
    // Add more tag styles as needed
  };
  var fDate = moment(Date()).format('DD-MM-YYYY');
  const formattedDate = moment(date).format('DD-MM-YYYY');
  console.log('formattedDate', formattedDate);
  console.log('fDate', fDate);
  // useEffect(() => {
  //   ding.setVolume(1);
  //   return () => {
  //     ding.release();
  //   };
  // }, []);
  useEffect(() => {
    // getNotify();
    getImgNotify();
    getTodayProfit();
    getWeeklyProfit();
    getMonthlyProfit();
  }, [notify]);
  const playPause = () => {
    ding.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  };

  const getTodayProfit = () => {
    axios
      .get(`https://crm.tradlogy.com/admin/today_profit_loss`)
      .then(response => {
        //console.log(response.data);
        setTodayProfit(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getWeeklyProfit = () => {
    axios
      .get(`https://crm.tradlogy.com/admin/weekely_profit_loss`)
      .then(response => {
        console.log(response.data);
        setWeeklyProfit(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getMonthlyProfit = () => {
    axios
      .get(`https://crm.tradlogy.com/admin/monthly_profit_loss`)
      .then(response => {
        console.log(response.data);
        setMonthlyProfit(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    dilyApi();
  }, []);
  const dilyApi = async () => {
    axios
      .get(`https://crm.tradlogy.com/user/viewoneuser`, {
        headers: {
          'auth-token': await AsyncStorage.getItem('auth-token'),
        },
      })
      .then(response => {
        // console.log('setExpFreeMem', response.data.data);
        setExpFreeMem(response.data.data.is_paid);
      })
      .catch(error => {
        console.log(error);
      });
  };
  // const chooseImg = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //     compressImageQuality: 0.7,
  //   }).then(image => {
  //     console.log(image);
  //     setPlImage(image.path);
  //     bs.current.snapTo(1);
  //   });
  // };
  const chooseImg = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
      } else if (response.errorCode === 'camera_unavailable') {
        Alert.alert('Camera not available on device');
      } else if (response.errorCode === 'permission') {
        Alert.alert('Permission not satisfied');
      } else if (response.errorCode === 'others') {
        Alert.alert(response.errorMessage);
      } else if (response.assets.length > 0) {
        // Image selected successfully
        const authToken = await AsyncStorage.getItem('auth-token');
        uploadImage(response.assets[0], authToken);
      }
    });
  };

  const uploadImage = async (selectedImage, authToken) => {
    const data = new FormData();
    data.append('pnlimg', {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName,
    });

    fetch('https://crm.tradlogy.com/admin/addPnlsheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'auth-token': authToken,
      },
      body: data,
    })
      .then(response => response.json())
      .then(res => {
        if (res.message === 'success') {
          Alert.alert('Image Uploaded Successfully👍');
        } else {
          Alert.alert('Something went wrong');
        }
      })
      .catch(error => {
        console.error('Upload Error: ', error);
        Alert.alert('Something went wrong');
      });
  };
  // <================ Get Notifivation API ==========>

  const getImgNotify = async () => {
    try {
      const authToken = await AsyncStorage.getItem('auth-token');

      if (!authToken) {
        // Handle the case where the auth token is not available
        return;
      }

      console.log('authToken', authToken);
      console.log('aaa', date);

      axios
        .get(
          `https://crm.tradlogy.com/admin/get_notification_user/${
            date ? date : fDate
          }`,
          {
            headers: {'auth-token': await AsyncStorage.getItem('auth-token')},
          },
        )
        .then(response => {
          const notify = response.data.data;
          setNotify(notify);
          console.log('notify', notify);
        })
        .catch(error => {
          console.log(error.response);
        });
    } catch (error) {
      console.error('Error retrieving auth token from AsyncStorage:', error);
    }
  };

  // const getImgNotify = async () => {
  //   axiosConfig
  //     .get(`/get_notification_user`)
  //     .then(response => {
  //       const notify = response.data.data;
  //       setImgNotify(notify);
  //       console.log(notify);
  //       //playPause();
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //     });
  // };

  // const getNotify = async () => {
  //   axiosConfig
  //     .get(`/notificationList`)
  //     .then(response => {
  //       const notify = response.data.data;
  //       setNotify(notify);
  //       //console.log(notify);
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //     });
  // };

  return (
    <ImageBackground
      source={require('../../Images/Background/bgImg.png')}
      style={styles.container}>
      <View>
        <View style={styles.mainView}>
          <View style={styles.firstView}>
            <Image
              style={styles.logoImg}
              resizeMode="contain"
              source={require('../../Images/top-left-logo/top-left-logo1.png')}
            />
          </View>

          <View style={styles.secondView}>
            <TouchableOpacity style={styles.dateTextView}>
              <View style={styles.tradeTextView}>
                <Text style={styles.tradeText}>Today's Results</Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {todayProfit?.total_prft_loss < 0 ? (
                  <Text style={[styles.tradeText1, {color: 'red'}]}>
                     {null}
                  </Text>
                ) : (
                  <Text style={[styles.tradeText1, {color: 'green'}]}>
                     {todayProfit?.total_prft_loss}
                  </Text>
                )}
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => setOpen(true)}>
                  <DatePicker
                    open={open}
                    date={date}
                    mode="date"
                    format="DD-MM-YYYY"
                    // minDate="2016-05-01"
                    // maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={setDate}
                    showIcon={true}
                    hideText={false}
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        marginRight: 10,

                        height: 20,
                        marginBottom: 0,
                      },
                      dateInput: {
                        marginLeft: 5,
                        borderWidth: 0,
                        marginBottom: 5,
                      },
                    }}
                  />
                  <View></View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.tradeTextView}>
                  <Text style={styles.tradeText2}>Total Performance</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Probabilities</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Text style={styles.modalText}>Today</Text>
                        {todayProfit?.total_prft_loss < 0 ? (
                          <Text style={[styles.modalText1, {color: 'red'}]}>
                             {todayProfit?.total_prft_loss}
                          </Text>
                        ) : (
                          <Text style={[styles.modalText1, {color: 'green'}]}>
                             {todayProfit?.total_prft_loss}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.modalText}>Weekly</Text>
                        {weeklyProfit?.weekly_profit_loss < 0 ? (
                          <Text style={[styles.modalText1, {color: 'red'}]}>
                             {weeklyProfit?.weekly_profit_loss}
                          </Text>
                        ) : (
                          <Text style={[styles.modalText1, {color: 'green'}]}>
                             {weeklyProfit?.weekly_profit_loss}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.modalText}>Monthly</Text>
                        {monthlyProfit?.thirtydays_prft_loss < 0 ? (
                          <Text style={[styles.modalText1, {color: 'red'}]}>
                             {monthlyProfit?.thirtydays_prft_loss}
                          </Text>
                        ) : (
                          <Text style={[styles.modalText1, {color: 'green'}]}>
                             {monthlyProfit?.thirtydays_prft_loss}
                          </Text>
                        )}
                      </View>
                    </View>
                    {/* <TouchableOpacity
                      style={styles.calender}
                      onPress={() => setOpen(true)}>
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '600',
                          fontSize: 15,
                          marginBottom: 20,
                        }}>
                        Select Date to view Trade Record
                      </Text>
                      <DatePicker
                        open={open}
                        date={date}
                        mode="date"
                        format="DD-MM-YYYY"
                        // minDate="2016-05-01"
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={setDate}
                        showIcon={true}
                        hideText={false}
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 5,
                            right: 5,
                            height: 18,
                          },
                          dateInput: {
                            marginLeft: 10,
                            borderWidth: 2,
                            borderRadius: 10,
                            padding: 10,
                          },
                        }}
                      />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.textStyle}>CLOSE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </View>
      {/* <================= Upload Component Start ============> */}
      <View>
        <View>
          <ListItem bottomDivider>
            <View style={styles.direction}>
              <View style={styles.d1}>
                <Text style={styles.uploadText}>
                  Upload your Probability Screenshot
                </Text>
              </View>
              <View style={styles.d2}>
                <TouchableOpacity
                  style={styles.uploadImage}
                  onPress={chooseImg}>
                  <Icon name="upload" color="green" size={25} />
                </TouchableOpacity>
              </View>
            </View>
          </ListItem>
        </View>

        {/* <================= Main Component Start ============> */}

        <ScrollView>
          <View style={{marginBottom: 200}}>
            {/* <==============jkkjkkk============> */}

            <View style={styles.listMainView}>
              {notify?.map(trade =>
                expFreeMem === '1' || expFreeMem === '3' ? (
                  new Date().getTime() - new Date(trade.createdAt).getTime() <=
                  30 * 60 * 1000 ? (
                    <View style={styles.bgarea2}>
                      <View
                        style={{
                          backgroundColor: '#000',
                          paddingVertical: 5,
                          paddingHorizontal: 32,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 10,
                        }}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={25}
                          color={'#fff'}
                          style={{marginVertical: 5}}
                        />
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 14,
                          }}>
                          This Trade will be visible after 30 minutes. Upgrade
                          to our premium service to view this instantly.
                        </Text>
                      </View>
                    </View>
                  ) : trade?.notify_type === '0' ? (
                    <ListItem bottomDivider key={trade?._id}>
                      <View style={styles.subView}>
                        <View
                          style={
                            trade && trade?.img && trade?.img.length > 0
                              ? styles.imageView
                              : styles.imageView2
                          }>
                          {trade && trade?.img && trade?.img.length > 0 ? (
                            <Image
                              source={{uri: `${trade?.img[0]}`}}
                              style={
                                trade && trade?.img && trade?.img.length > 0
                                  ? styles.imageGraph
                                  : styles.imageGraph2
                              }
                            />
                          ) : (
                            <Text style={styles.SimpleText}>
                              No Image found
                            </Text>
                          )}
                        </View>
                        <View style={styles.textView}>
                          <Text style={styles.headText}>{trade?.title}</Text>
                          {/* <RenderHTML
                        contentWidth={width}
                        tagsStyles={tagsStyles}
                        source={{html: trade?.desc}}
                      /> */}
                          <Text style={styles.SimpleText}>{trade?.desc}</Text>
                        </View>
                      </View>
                    </ListItem>
                  ) : trade?.notify_type === '2' ||
                    trade?.trade_update_type === '1' ? (
                    <View style={{borderBottomWidth: 1}}>
                      <View style={styles.bgarea2}>
                        <View style={styles.botomview3}>
                          <Text style={styles.bgText}>
                            {trade?.trade?.call_type}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={styles.bgarea3}>
                          <View>
                            <Text style={styles.buy}>
                              {trade?.trade?.script_type}
                            </Text>
                          </View>
                          {trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                            '' &&
                          trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                            undefined &&
                          trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                            null ? (
                            <View>
                              <Text style={styles.notbuy}>
                                {trade?.trade?.fnoequty_scrpt_name?.scriptName}{' '}
                                @ {trade?.trade?.active_value} -{' '}
                                {trade?.trade?.active_value2}
                              </Text>
                            </View>
                          ) : trade?.trade?.cash_scrpt_name?.scriptName != '' &&
                            trade?.trade?.cash_scrpt_name?.scriptName !=
                              undefined &&
                            trade?.trade?.cash_scrpt_name?.scriptName !=
                              null ? (
                            <View>
                              <Text style={styles.notbuy}>
                                {trade?.trade?.cash_scrpt_name?.scriptName} @{' '}
                                {trade?.trade?.active_value} -{' '}
                                {trade?.trade?.active_value2}
                              </Text>
                            </View>
                          ) : trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                              '' &&
                            trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                              undefined &&
                            trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                              null ? (
                            <View>
                              <Text style={styles.notbuy}>
                                {trade?.trade?.fnoindex_scrpt_name?.scriptName}{' '}
                                @ {trade?.trade?.active_value} -{' '}
                                {trade?.trade?.active_value2}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        {/* <View>
                        <Text style={{color: '#333'}}>Show Trade</Text>
                      </View> */}
                      </View>

                      {/* <===========SL=============> */}
                      <View style={styles.bgarea2}>
                        {trade?.trade?.sl_type === 'false' ? (
                          <View
                            style={[styles.circle1, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy1}>
                              SL{'\n'}
                              {trade?.trade?.SL}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle1,
                              {backgroundColor: '#ef9a9a'},
                            ]}>
                            <Text style={styles.notbuy1}>
                              SL{'\n'}
                              {trade?.trade?.SL}
                            </Text>
                          </View>
                        )}
                        {/* <===========T1 =============> */}
                        {trade?.trade?.trl != '' &&
                        trade?.trade?.trl != null &&
                        trade?.trade?.trl != undefined ? (
                          <View>
                            {trade?.trade?.trl_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  TRL{'\n'}
                                  {trade?.trade?.trl}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  TRL{'\n'}
                                  {trade?.trade?.trl}
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            {trade?.trade?.t1_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 1{'\n'}
                                  {trade?.trade?.T1}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 1{'\n'}
                                  {trade?.trade?.T1}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}

                        {/* <===========T2 =============> */}

                        {trade?.trade?.FT1 != '' &&
                        trade?.trade?.FT1 != null &&
                        trade?.trade?.FT1 != undefined ? (
                          <View>
                            {trade?.trade?.FT1_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 1{'\n'}
                                  {trade?.trade?.FT1}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 1{'\n'}
                                  {trade?.trade?.FT1}
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            {trade?.trade?.t2_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 2{'\n'}
                                  {trade?.trade?.T2}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 2{'\n'}
                                  {trade?.trade?.T2}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}

                        {/* <===========T3 =============> */}

                        {trade?.trade?.FT2 != '' &&
                        trade?.trade?.FT2 != null &&
                        trade?.trade?.FT2 != undefined ? (
                          <View>
                            {trade?.trade?.FT2_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 2{'\n'}
                                  {trade?.trade?.FT2}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 2{'\n'}
                                  {trade?.trade?.FT2}
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            {trade?.trade?.t3_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 3{'\n'}
                                  {trade?.trade?.T3}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 3{'\n'}
                                  {trade?.trade?.T3}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}

                        {/* <===========T4 =============> */}

                        {trade?.trade?.FT3 != '' &&
                        trade?.trade?.FT3 != null &&
                        trade?.trade?.FT3 != undefined ? (
                          <View>
                            {trade?.trade?.FT3_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 3{'\n'}
                                  {trade?.trade?.FT3}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 3{'\n'}
                                  {trade?.trade?.FT3}
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            {trade?.trade?.t4_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 4{'\n'}
                                  {trade?.trade?.T4}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle,
                                  {backgroundColor: '#66bb6a'},
                                ]}>
                                <Text style={styles.notbuy}>
                                  T 4{'\n'}
                                  {trade?.trade?.T4}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>

                      {/* <================Botton Area=============> */}
                      <View style={styles.bgarea2}>
                        <View style={styles.botomview1}>
                          <Text style={styles.bottomText}>
                            Quantity & Total Points
                          </Text>
                          <Text style={styles.bottomText1}>
                            {trade?.trade?.no_of_lots} Lots(
                            {trade?.trade?.qty * trade?.trade?.no_of_lots} Qty)
                            = {trade?.trade?.investment_amt}
                          </Text>
                        </View>
                        <View style={styles.botomview2}>
                          <Text style={styles.bottomText1}>Probability</Text>
                          {trade.pl < 0 ? (
                            <Text
                              style={[styles.bottomText1, , {color: 'red'}]}>
                               {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                            </Text>
                          ) : (
                            <Text
                              style={[styles.bottomText1, , {color: 'green'}]}>
                               {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* <================ Date and Show more=============> */}
                      <View style={styles.bgarea2}>
                        <View style={styles.botomview3}>
                          <Text style={styles.dateText}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.createdAt}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                      {/* <View>
                      <Collapse>
                        <CollapseHeader>
                          <View style={{margin: 5}}>
                            <Text style={{color: 'blue'}}>
                              View Trade History
                            </Text>
                          </View>
                        </CollapseHeader>
                        <CollapseBody>
                          {trade.t1_type === 'true' ||
                          trade.FT1_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 1st Target {trade?.trade?.T1}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 1st Target {trade?.trade?.T1}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 1st Target {trade?.trade?.FT1}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                {trade?.trade?.FT1time !== '' ? (
                                  <Text style={styles.dropTextOne}>
                                    <Moment element={Text} format="llll">
                                      {trade?.trade?.FT1time}
                                    </Moment>
                                  </Text>
                                ) : (
                                  <Text style={styles.dropTextOne}>
                                    <Moment element={Text} format="lll">
                                      {trade?.trade?.T1time}
                                    </Moment>
                                  </Text>
                                )}
                              </View>
                            </View>
                          ) : null}
                          {trade.t2_type === 'true' ||
                          trade.FT2_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 2st Target {trade?.trade?.T2}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 2st Target {trade?.trade?.T2}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 2st Target {trade?.trade?.FT2}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t3_type === 'true' ||
                          trade.FT3_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 3st Target {trade?.trade?.T3}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 3st Target {trade?.trade?.T3}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 3st Target {trade?.trade?.FT3}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t4_type === 'true' ||
                          trade.FT4_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 4th Target {trade?.trade?.T4}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 4th Target {trade?.trade?.T4}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 4th Target {trade?.trade?.FT4}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t5_type === 'true' ||
                          trade.FT5_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 5th Target
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 5th Target
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 5th Target
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t6_type === 'true' ||
                          trade.FT6_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 6th Target
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 6th Target
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 6th Target
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade?.trade?.t7_type === 'true' ||
                          trade?.trade?.FT7_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName !== undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 7th Target
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name
                                    ?.scriptName !== undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 7th Target
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName !== undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 7th Target
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                        </CollapseBody>
                      </Collapse>
                    </View> */}

                      {/* <View>
                      <Text style={{color: '#000', marginVertical: 5}}>
                        SL has been Hit your trade is out
                      </Text>
                    </View> */}
                      {/* <View>
                        <Text style={{color: '#000', marginVertical: 5}}>
                          {trade?.trade?.cstmMsg}
                        </Text>
                      </View> */}
                      {/* <============Seemore=========> */}
                    </View>
                  ) : (
                    <View style={{borderBottomWidth: 1}}>
                      <Collapse>
                        <CollapseHeader>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View>
                              <View>
                                <Text style={styles.notbuy}>{trade?.desc}</Text>
                              </View>

                              <Text style={{color: '#d3d3d3', padding: 5}}>
                                <Moment
                                  element={Text}
                                  format="DD-MM-YYYY HH:mm:ss">
                                  {trade?.trade?.createdAt}
                                </Moment>
                              </Text>
                            </View>
                            <View>
                              <Text style={{color: '#333'}}>Show Trade</Text>
                            </View>
                          </View>
                        </CollapseHeader>
                        <CollapseBody>
                          <View style={styles.bgarea2}>
                            <View style={styles.botomview3}>
                              <Text style={styles.bgText}>
                                {trade?.trade?.call_type}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.bgarea3}>
                            <View>
                              <Text style={styles.buy}>
                                {trade?.trade?.script_type}
                              </Text>
                            </View>
                            {trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                              '' &&
                            trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined &&
                            trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                              null ? (
                              <View>
                                <Text style={styles.notbuy}>
                                  {
                                    trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName
                                  }{' '}
                                  @ {trade?.trade?.active_value} -{' '}
                                  {trade?.trade?.active_value2}
                                </Text>
                              </View>
                            ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                '' &&
                              trade?.trade?.cash_scrpt_name?.scriptName !=
                                undefined &&
                              trade?.trade?.cash_scrpt_name?.scriptName !=
                                null ? (
                              <View>
                                <Text style={styles.notbuy}>
                                  {trade?.trade?.cash_scrpt_name?.scriptName} @{' '}
                                  {trade?.trade?.active_value} -{' '}
                                  {trade?.trade?.active_value2}
                                </Text>
                              </View>
                            ) : trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                                '' &&
                              trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined &&
                              trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                                null ? (
                              <View>
                                <Text style={styles.notbuy}>
                                  {
                                    trade?.trade?.fnoindex_scrpt_name
                                      ?.scriptName
                                  }{' '}
                                  @ {trade?.trade?.active_value} -{' '}
                                  {trade?.trade?.active_value2}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                          {/* <===========SL=============> */}
                          <View style={styles.bgarea2}>
                            {trade?.trade?.sl_type === 'false' ? (
                              <View
                                style={[
                                  styles.circle1,
                                  {backgroundColor: '#fff'},
                                ]}>
                                <Text style={styles.notbuy1}>
                                  SL{'\n'}
                                  {trade?.trade?.SL}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.circle1,
                                  {backgroundColor: '#ef9a9a'},
                                ]}>
                                <Text style={styles.notbuy1}>
                                  SL{'\n'}
                                  {trade?.trade?.SL}
                                </Text>
                              </View>
                            )}
                            {/* <===========T1 =============> */}
                            {trade?.trade?.trl != '' &&
                            trade?.trade?.trl != null &&
                            trade?.trade?.trl != undefined ? (
                              <View>
                                {trade?.trade?.trl_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      TRL{'\n'}
                                      {trade?.trade?.trl}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      TRL{'\n'}
                                      {trade?.trade?.trl}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                {trade?.trade?.t1_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 1{'\n'}
                                      {trade?.trade?.T1}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 1{'\n'}
                                      {trade?.trade?.T1}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}

                            {/* <===========T2 =============> */}

                            {trade?.trade?.FT1 != '' &&
                            trade?.trade?.FT1 != null &&
                            trade?.trade?.FT1 != undefined ? (
                              <View>
                                {trade?.trade?.FT1_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 1{'\n'}
                                      {trade?.trade?.FT1}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 1{'\n'}
                                      {trade?.trade?.FT1}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                {trade?.trade?.t2_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 2{'\n'}
                                      {trade?.trade?.T2}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 2{'\n'}
                                      {trade?.trade?.T2}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}

                            {/* <===========T3 =============> */}

                            {trade?.trade?.FT2 != '' &&
                            trade?.trade?.FT2 != null &&
                            trade?.trade?.FT2 != undefined ? (
                              <View>
                                {trade?.trade?.FT2_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 2{'\n'}
                                      {trade?.trade?.FT2}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 2{'\n'}
                                      {trade?.trade?.FT2}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                {trade?.trade?.t3_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 3{'\n'}
                                      {trade?.trade?.T3}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 3{'\n'}
                                      {trade?.trade?.T3}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}

                            {/* <===========T4 =============> */}

                            {trade?.trade?.FT3 != '' &&
                            trade?.trade?.FT3 != null &&
                            trade?.trade?.FT3 != undefined ? (
                              <View>
                                {trade?.trade?.FT3_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 3{'\n'}
                                      {trade?.trade?.FT3}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 3{'\n'}
                                      {trade?.trade?.FT3}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                {trade?.trade?.t4_type === 'false' ? (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#fff'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 4{'\n'}
                                      {trade?.trade?.T4}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={[
                                      styles.circle,
                                      {backgroundColor: '#66bb6a'},
                                    ]}>
                                    <Text style={styles.notbuy}>
                                      T 4{'\n'}
                                      {trade?.trade?.T4}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>

                          {/* <================Botton Area=============> */}
                          <View style={styles.bgarea2}>
                            <View style={styles.botomview1}>
                              <Text style={styles.bottomText}>
                                Quantity & Total Points
                              </Text>
                              <Text style={styles.bottomText1}>
                                {trade?.trade?.no_of_lots} Lots(
                                {trade?.trade?.qty *
                                  trade?.trade?.no_of_lots}{' '}
                                Qty) = {trade?.trade?.investment_amt}
                              </Text>
                            </View>
                            <View style={styles.botomview2}>
                              <Text style={styles.bottomText1}>Probability</Text>
                              {trade.pl < 0 ? (
                                <Text
                                  style={[
                                    styles.bottomText1,
                                    ,
                                    {color: 'red'},
                                  ]}>
                                   {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                                </Text>
                              ) : (
                                <Text
                                  style={[
                                    styles.bottomText1,
                                    ,
                                    {color: 'green'},
                                  ]}>
                                   {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                                </Text>
                              )}
                            </View>
                          </View>

                          {/* <================ Date and Show more=============> */}
                          <View style={styles.bgarea2}>
                            <View style={styles.botomview3}>
                              <Text style={styles.dateText}>
                                <Moment
                                  element={Text}
                                  format="DD-MM-YYYY HH:mm:ss">
                                  {trade?.createdAt}
                                </Moment>
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Collapse>
                              <CollapseHeader>
                                <View style={{margin: 5}}>
                                  {trade?.trade &&
                                  trade?.trade?.alerthistory &&
                                  trade?.trade?.alerthistory?.length > 0 ? (
                                    <Text style={{color: '#a82682'}}>
                                      View Trade History
                                    </Text>
                                  ) : null}
                                </View>
                              </CollapseHeader>
                              <CollapseBody>
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade &&
                                    trade?.trade?.alerthistory &&
                                    trade?.trade?.alerthistory?.length > 0 ? (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                        }}>
                                        <View
                                          style={{
                                            width: '60%',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                          }}>
                                          {trade?.trade?.alerthistory.map(
                                            (alert, index) => (
                                              <Text
                                                key={index}
                                                style={[
                                                  styles.dropTextOne,
                                                  {marginVertical: 5},
                                                ]}>
                                                {alert.alert_message}
                                              </Text>
                                            ),
                                          )}
                                        </View>
                                        <View
                                          style={{
                                            width: '30%',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                          }}>
                                          {trade?.trade?.alerthistory.map(
                                            (alert, index) => (
                                              <Text
                                                key={index}
                                                style={[
                                                  styles.dropTextOne,
                                                  {
                                                    marginVertical: 5,
                                                  },
                                                ]}>
                                                <Moment
                                                  element={Text}
                                                  format="DD-MM-YYYY hh:mm:ss A">
                                                  {alert?.createdAt}
                                                </Moment>
                                              </Text>
                                            ),
                                          )}
                                        </View>
                                      </View>
                                    ) : null}
                                  </View>
                                </View>
                                {/* {trade.t1_type === 'true' ||
                              trade.FT1_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 1st Target {trade?.trade?.T1}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 1st Target {trade?.trade?.T1}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 1st Target {trade?.trade?.FT1}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    {trade?.trade?.FT1time !== '' ? (
                                      <Text style={styles.dropTextOne}>
                                        <Moment element={Text} format="llll">
                                          {trade?.trade?.FT1time}
                                        </Moment>
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropTextOne}>
                                        <Moment element={Text} format="lll">
                                          {trade?.trade?.T1time}
                                        </Moment>
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              ) : null}
                              {trade.t2_type === 'true' ||
                              trade.FT2_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 2st Target {trade?.trade?.T2}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 2st Target {trade?.trade?.T2}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 2st Target {trade?.trade?.FT2}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t3_type === 'true' ||
                              trade.FT3_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 3st Target {trade?.trade?.T3}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 3st Target {trade?.trade?.T3}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 3st Target {trade?.trade?.FT3}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t4_type === 'true' ||
                              trade.FT4_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 4th Target {trade?.trade?.T4}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 4th Target {trade?.trade?.T4}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 4th Target {trade?.trade?.FT4}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t5_type === 'true' ||
                              trade.FT5_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 5th Target
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 5th Target
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 5th Target
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t6_type === 'true' ||
                              trade.FT6_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 6th Target
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 6th Target
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 6th Target
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t7_type === 'true' ||
                              trade.FT7_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName !== undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 7th Target
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName !== undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 7th Target
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName !== undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 7th Target
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null} */}
                              </CollapseBody>
                            </Collapse>
                          </View>

                          {/* <View>
                          <Text style={{color: '#000', marginVertical: 5}}>
                            SL has been Hit your trade is out
                          </Text>
                        </View> */}
                          {/* <View>
                            <Text style={{color: '#000', marginVertical: 5}}>
                              {trade?.trade?.cstmMsg}
                            </Text>
                          </View> */}
                        </CollapseBody>
                      </Collapse>
                      {/* <============Seemore=========> */}
                    </View>
                  )
                ) : trade?.notify_type === '0' ? (
                  <ListItem bottomDivider key={trade?._id}>
                    <View style={styles.subView}>
                      <View
                        style={
                          trade && trade?.img && trade?.img.length > 0
                            ? styles.imageView
                            : styles.imageView2
                        }>
                        {trade && trade?.img && trade?.img.length > 0 ? (
                          <Image
                            source={{uri: `${trade?.img[0]}`}}
                            style={
                              trade && trade?.img && trade?.img.length > 0
                                ? styles.imageGraph
                                : styles.imageGraph2
                            }
                          />
                        ) : (
                          <Text style={styles.SimpleText}>No Image found</Text>
                        )}
                      </View>
                      <View style={styles.textView}>
                        <Text style={styles.headText}>{trade?.title}</Text>
                        {/* <RenderHTML
                        contentWidth={width}
                        tagsStyles={tagsStyles}
                        source={{html: trade?.desc}}
                      /> */}
                        <Text style={styles.SimpleText}>{trade?.desc}</Text>
                      </View>
                    </View>
                  </ListItem>
                ) : trade?.notify_type === '2' ||
                  trade?.trade_update_type === '1' ? (
                  <View style={{borderBottomWidth: 1}}>
                    <View style={styles.bgarea2}>
                      <View style={styles.botomview3}>
                        <Text style={styles.bgText}>
                          {trade?.trade?.call_type}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View style={styles.bgarea3}>
                        <View>
                          <Text style={styles.buy}>
                            {trade?.trade?.script_type}
                          </Text>
                        </View>
                        {trade?.trade?.fnoequty_scrpt_name?.scriptName != '' &&
                        trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                          undefined &&
                        trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                          null ? (
                          <View>
                            <Text style={styles.notbuy}>
                              {trade?.trade?.fnoequty_scrpt_name?.scriptName} @{' '}
                              {trade?.trade?.active_value} -{' '}
                              {trade?.trade?.active_value2}
                            </Text>
                          </View>
                        ) : trade?.trade?.cash_scrpt_name?.scriptName != '' &&
                          trade?.trade?.cash_scrpt_name?.scriptName !=
                            undefined &&
                          trade?.trade?.cash_scrpt_name?.scriptName != null ? (
                          <View>
                            <Text style={styles.notbuy}>
                              {trade?.trade?.cash_scrpt_name?.scriptName} @{' '}
                              {trade?.trade?.active_value} -{' '}
                              {trade?.trade?.active_value2}
                            </Text>
                          </View>
                        ) : trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                            '' &&
                          trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                            undefined &&
                          trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                            null ? (
                          <View>
                            <Text style={styles.notbuy}>
                              {trade?.trade?.fnoindex_scrpt_name?.scriptName} @{' '}
                              {trade?.trade?.active_value} -{' '}
                              {trade?.trade?.active_value2}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      {/* <View>
                        <Text style={{color: '#333'}}>Show Trade</Text>
                      </View> */}
                    </View>

                    {/* <===========SL=============> */}
                    <View style={styles.bgarea2}>
                      {trade?.trade?.sl_type === 'false' ? (
                        <View
                          style={[styles.circle1, {backgroundColor: '#fff'}]}>
                          <Text style={styles.notbuy1}>
                            SL{'\n'}
                            {trade?.trade?.SL}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.circle1,
                            {backgroundColor: '#ef9a9a'},
                          ]}>
                          <Text style={styles.notbuy1}>
                            SL{'\n'}
                            {trade?.trade?.SL}
                          </Text>
                        </View>
                      )}
                      {/* <===========T1 =============> */}
                      {trade?.trade?.trl != '' &&
                      trade?.trade?.trl != null &&
                      trade?.trade?.trl != undefined ? (
                        <View>
                          {trade?.trade?.trl_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                TRL{'\n'}
                                {trade?.trade?.trl}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                TRL{'\n'}
                                {trade?.trade?.trl}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {trade?.trade?.t1_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 1{'\n'}
                                {trade?.trade?.T1}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 1{'\n'}
                                {trade?.trade?.T1}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      {/* <===========T2 =============> */}

                      {trade?.trade?.FT1 != '' &&
                      trade?.trade?.FT1 != null &&
                      trade?.trade?.FT1 != undefined ? (
                        <View>
                          {trade?.trade?.FT1_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 1{'\n'}
                                {trade?.trade?.FT1}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 1{'\n'}
                                {trade?.trade?.FT1}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {trade?.trade?.t2_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 2{'\n'}
                                {trade?.trade?.T2}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 2{'\n'}
                                {trade?.trade?.T2}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      {/* <===========T3 =============> */}

                      {trade?.trade?.FT2 != '' &&
                      trade?.trade?.FT2 != null &&
                      trade?.trade?.FT2 != undefined ? (
                        <View>
                          {trade?.trade?.FT2_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 2{'\n'}
                                {trade?.trade?.FT2}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 2{'\n'}
                                {trade?.trade?.FT2}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {trade?.trade?.t3_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 3{'\n'}
                                {trade?.trade?.T3}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 3{'\n'}
                                {trade?.trade?.T3}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      {/* <===========T4 =============> */}

                      {trade?.trade?.FT3 != '' &&
                      trade?.trade?.FT3 != null &&
                      trade?.trade?.FT3 != undefined ? (
                        <View>
                          {trade?.trade?.FT3_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 3{'\n'}
                                {trade?.trade?.FT3}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 3{'\n'}
                                {trade?.trade?.FT3}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {trade?.trade?.t4_type === 'false' ? (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 4{'\n'}
                                {trade?.trade?.T4}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle,
                                {backgroundColor: '#66bb6a'},
                              ]}>
                              <Text style={styles.notbuy}>
                                T 4{'\n'}
                                {trade?.trade?.T4}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    {/* <================Botton Area=============> */}
                    <View style={styles.bgarea2}>
                      <View style={styles.botomview1}>
                        <Text style={styles.bottomText}>
                          Quantity & Total Points
                        </Text>
                        <Text style={styles.bottomText1}>
                          {trade?.trade?.no_of_lots} Lots(
                          {trade?.trade?.qty * trade?.trade?.no_of_lots} Qty) =
                          {trade?.trade?.investment_amt}
                        </Text>
                      </View>
                      <View style={styles.botomview2}>
                        <Text style={styles.bottomText1}>Probability</Text>
                        {trade.pl < 0 ? (
                          <Text style={[styles.bottomText1, , {color: 'red'}]}>
                             {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                          </Text>
                        ) : (
                          <Text
                            style={[styles.bottomText1, , {color: 'green'}]}>
                             {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* <================ Date and Show more=============> */}
                    <View style={styles.bgarea2}>
                      <View style={styles.botomview3}>
                        <Text style={styles.dateText}>
                          <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                            {trade?.createdAt}
                          </Moment>
                        </Text>
                      </View>
                    </View>
                    {/* <View>
                      <Collapse>
                        <CollapseHeader>
                          <View style={{margin: 5}}>
                            <Text style={{color: 'blue'}}>
                              View Trade History
                            </Text>
                          </View>
                        </CollapseHeader>
                        <CollapseBody>
                          {trade.t1_type === 'true' ||
                          trade.FT1_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 1st Target {trade?.trade?.T1}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 1st Target {trade?.trade?.T1}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 1st Target {trade?.trade?.FT1}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                {trade?.trade?.FT1time !== '' ? (
                                  <Text style={styles.dropTextOne}>
                                    <Moment element={Text} format="llll">
                                      {trade?.trade?.FT1time}
                                    </Moment>
                                  </Text>
                                ) : (
                                  <Text style={styles.dropTextOne}>
                                    <Moment element={Text} format="lll">
                                      {trade?.trade?.T1time}
                                    </Moment>
                                  </Text>
                                )}
                              </View>
                            </View>
                          ) : null}
                          {trade.t2_type === 'true' ||
                          trade.FT2_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 2st Target {trade?.trade?.T2}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 2st Target {trade?.trade?.T2}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 2st Target {trade?.trade?.FT2}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t3_type === 'true' ||
                          trade.FT3_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 3st Target {trade?.trade?.T3}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 3st Target {trade?.trade?.T3}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 3st Target {trade?.trade?.FT3}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t4_type === 'true' ||
                          trade.FT4_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 4th Target {trade?.trade?.T4}+
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 4th Target {trade?.trade?.T4}+
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 4th Target {trade?.trade?.FT4}+
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t5_type === 'true' ||
                          trade.FT5_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 5th Target
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 5th Target
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 5th Target
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade.t6_type === 'true' ||
                          trade.FT6_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 6th Target
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name?.scriptName !=
                                  undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 6th Target
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName != undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 6th Target
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                          {trade?.trade?.t7_type === 'true' ||
                          trade?.trade?.FT7_type === 'true' ? (
                            <View style={styles.showView}>
                              <View style={styles.insideViewOne}>
                                {trade?.trade?.fnoequty_scrpt_name
                                  ?.scriptName !== undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoequty_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 7th Target
                                  </Text>
                                ) : trade?.trade?.cash_scrpt_name
                                    ?.scriptName !== undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {trade?.trade?.cash_scrpt_name?.scriptName}{' '}
                                    @ 7th Target
                                  </Text>
                                ) : trade?.trade?.fnoindex_scrpt_name
                                    ?.scriptName !== undefined ? (
                                  <Text style={styles.dropTextOne}>
                                    {
                                      trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName
                                    }{' '}
                                    @ 7th Target
                                  </Text>
                                ) : null}
                              </View>
                              <View style={styles.insideViewTwo}>
                                <Text style={styles.dropTextOne}>
                                  22-08-2022
                                </Text>
                              </View>
                            </View>
                          ) : null}
                        </CollapseBody>
                      </Collapse>
                    </View> */}

                    {/* <View>
                      <Text style={{color: '#000', marginVertical: 5}}>
                        SL has been Hit your trade is out
                      </Text>
                    </View> */}
                    {/* <View>
                      <Text style={{color: '#000', marginVertical: 5}}>
                        {trade?.trade?.cstmMsg}
                      </Text>
                    </View> */}
                    {/* <============Seemore=========> */}
                  </View>
                ) : (
                  <View style={{borderBottomWidth: 1}}>
                    <Collapse>
                      <CollapseHeader>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View>
                            <View>
                              <Text style={styles.notbuy}>{trade?.desc}</Text>
                            </View>

                            <Text style={{color: '#d3d3d3', padding: 5}}>
                              <Moment
                                element={Text}
                                format="DD-MM-YYYY HH:mm:ss">
                                {trade?.trade?.createdAt}
                              </Moment>
                            </Text>
                          </View>
                          <View>
                            <Text style={{color: '#333'}}>Show Trade</Text>
                          </View>
                        </View>
                      </CollapseHeader>
                      <CollapseBody>
                        <View style={styles.bgarea2}>
                          <View style={styles.botomview3}>
                            <Text style={styles.bgText}>
                              {trade?.trade?.call_type}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.bgarea3}>
                          <View>
                            <Text style={styles.buy}>
                              {trade?.trade?.script_type}
                            </Text>
                          </View>
                          {trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                            '' &&
                          trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                            undefined &&
                          trade?.trade?.fnoequty_scrpt_name?.scriptName !=
                            null ? (
                            <View>
                              <Text style={styles.notbuy}>
                                {trade?.trade?.fnoequty_scrpt_name?.scriptName}{' '}
                                @ {trade?.trade?.active_value} -{' '}
                                {trade?.trade?.active_value2}
                              </Text>
                            </View>
                          ) : trade?.trade?.cash_scrpt_name?.scriptName != '' &&
                            trade?.trade?.cash_scrpt_name?.scriptName !=
                              undefined &&
                            trade?.trade?.cash_scrpt_name?.scriptName !=
                              null ? (
                            <View>
                              <Text style={styles.notbuy}>
                                {trade?.trade?.cash_scrpt_name?.scriptName} @{' '}
                                {trade?.trade?.active_value} -{' '}
                                {trade?.trade?.active_value2}
                              </Text>
                            </View>
                          ) : trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                              '' &&
                            trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                              undefined &&
                            trade?.trade?.fnoindex_scrpt_name?.scriptName !=
                              null ? (
                            <View>
                              <Text style={styles.notbuy}>
                                {trade?.trade?.fnoindex_scrpt_name?.scriptName}{' '}
                                @ {trade?.trade?.active_value} -{' '}
                                {trade?.trade?.active_value2}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        {/* <===========SL=============> */}
                        <View style={styles.bgarea2}>
                          {trade?.trade?.sl_type === 'false' ? (
                            <View
                              style={[
                                styles.circle1,
                                {backgroundColor: '#fff'},
                              ]}>
                              <Text style={styles.notbuy1}>
                                SL{'\n'}
                                {trade?.trade?.SL}
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.circle1,
                                {backgroundColor: '#ef9a9a'},
                              ]}>
                              <Text style={styles.notbuy1}>
                                SL{'\n'}
                                {trade?.trade?.SL}
                              </Text>
                            </View>
                          )}
                          {/* <===========T1 =============> */}
                          {trade?.trade?.trl != '' &&
                          trade?.trade?.trl != null &&
                          trade?.trade?.trl != undefined ? (
                            <View>
                              {trade?.trade?.trl_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    TRL{'\n'}
                                    {trade?.trade?.trl}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    TRL{'\n'}
                                    {trade?.trade?.trl}
                                  </Text>
                                </View>
                              )}
                            </View>
                          ) : (
                            <View>
                              {trade?.trade?.t1_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 1{'\n'}
                                    {trade?.trade?.T1}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 1{'\n'}
                                    {trade?.trade?.T1}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}

                          {/* <===========T2 =============> */}

                          {trade?.trade?.FT1 != '' &&
                          trade?.trade?.FT1 != null &&
                          trade?.trade?.FT1 != undefined ? (
                            <View>
                              {trade?.trade?.FT1_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 1{'\n'}
                                    {trade?.trade?.FT1}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 1{'\n'}
                                    {trade?.trade?.FT1}
                                  </Text>
                                </View>
                              )}
                            </View>
                          ) : (
                            <View>
                              {trade?.trade?.t2_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 2{'\n'}
                                    {trade?.trade?.T2}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 2{'\n'}
                                    {trade?.trade?.T2}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}

                          {/* <===========T3 =============> */}

                          {trade?.trade?.FT2 != '' &&
                          trade?.trade?.FT2 != null &&
                          trade?.trade?.FT2 != undefined ? (
                            <View>
                              {trade?.trade?.FT2_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 2{'\n'}
                                    {trade?.trade?.FT2}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 2{'\n'}
                                    {trade?.trade?.FT2}
                                  </Text>
                                </View>
                              )}
                            </View>
                          ) : (
                            <View>
                              {trade?.trade?.t3_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 3{'\n'}
                                    {trade?.trade?.T3}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 3{'\n'}
                                    {trade?.trade?.T3}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}

                          {/* <===========T4 =============> */}

                          {trade?.trade?.FT3 != '' &&
                          trade?.trade?.FT3 != null &&
                          trade?.trade?.FT3 != undefined ? (
                            <View>
                              {trade?.trade?.FT3_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 3{'\n'}
                                    {trade?.trade?.FT3}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 3{'\n'}
                                    {trade?.trade?.FT3}
                                  </Text>
                                </View>
                              )}
                            </View>
                          ) : (
                            <View>
                              {trade?.trade?.t4_type === 'false' ? (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#fff'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 4{'\n'}
                                    {trade?.trade?.T4}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    styles.circle,
                                    {backgroundColor: '#66bb6a'},
                                  ]}>
                                  <Text style={styles.notbuy}>
                                    T 4{'\n'}
                                    {trade?.trade?.T4}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>

                        {/* <================Botton Area=============> */}
                        <View style={styles.bgarea2}>
                          <View style={styles.botomview1}>
                            <Text style={styles.bottomText}>
                              Quantity & Total Points
                            </Text>
                            <Text style={styles.bottomText1}>
                              {trade?.trade?.no_of_lots} Lots(
                              {trade?.trade?.qty *
                                trade?.trade?.no_of_lots}{' '}
                              Qty) = {trade?.trade?.investment_amt}
                            </Text>
                          </View>
                          <View style={styles.botomview2}>
                            <Text style={styles.bottomText1}>Probability</Text>
                            {trade.pl < 0 ? (
                              <Text
                                style={[styles.bottomText1, , {color: 'red'}]}>
                                 {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                              </Text>
                            ) : (
                              <Text
                                style={[
                                  styles.bottomText1,
                                  ,
                                  {color: 'green'},
                                ]}>
                                 {trade?.trade?.pl} | {trade?.trade?.pl_per}%
                              </Text>
                            )}
                          </View>
                        </View>

                        {/* <================ Date and Show more=============> */}
                        <View style={styles.bgarea2}>
                          <View style={styles.botomview3}>
                            <Text style={styles.dateText}>
                              <Moment
                                element={Text}
                                format="DD-MM-YYYY HH:mm:ss">
                                {trade?.createdAt}
                              </Moment>
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Collapse>
                            <CollapseHeader>
                              <View style={{margin: 5}}>
                                {trade?.trade &&
                                trade?.trade?.alerthistory &&
                                trade?.trade?.alerthistory?.length > 0 ? (
                                  <Text style={{color: '#a82682'}}>
                                    View Trade History
                                  </Text>
                                ) : null}
                              </View>
                            </CollapseHeader>
                            <CollapseBody>
                              <View style={styles.showView}>
                                <View style={styles.insideViewOne}>
                                  {trade?.trade &&
                                  trade?.trade?.alerthistory &&
                                  trade?.trade?.alerthistory?.length > 0 ? (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <View
                                        style={{
                                          width: '60%',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}>
                                        {trade?.trade?.alerthistory.map(
                                          (alert, index) => (
                                            <Text
                                              key={index}
                                              style={[
                                                styles.dropTextOne,
                                                {marginVertical: 5},
                                              ]}>
                                              {alert.alert_message}
                                            </Text>
                                          ),
                                        )}
                                      </View>
                                      <View
                                        style={{
                                          width: '30%',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}>
                                        {trade?.trade?.alerthistory.map(
                                          (alert, index) => (
                                            <Text
                                              key={index}
                                              style={[
                                                styles.dropTextOne,
                                                {
                                                  marginVertical: 5,
                                                },
                                              ]}>
                                              <Moment
                                                element={Text}
                                                format="DD-MM-YYYY hh:mm:ss A">
                                                {alert?.createdAt}
                                              </Moment>
                                            </Text>
                                          ),
                                        )}
                                      </View>
                                    </View>
                                  ) : null}
                                </View>
                              </View>
                              {/* {trade.t1_type === 'true' ||
                              trade.FT1_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 1st Target {trade?.trade?.T1}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 1st Target {trade?.trade?.T1}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 1st Target {trade?.trade?.FT1}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    {trade?.trade?.FT1time !== '' ? (
                                      <Text style={styles.dropTextOne}>
                                        <Moment element={Text} format="llll">
                                          {trade?.trade?.FT1time}
                                        </Moment>
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropTextOne}>
                                        <Moment element={Text} format="lll">
                                          {trade?.trade?.T1time}
                                        </Moment>
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              ) : null}
                              {trade.t2_type === 'true' ||
                              trade.FT2_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 2st Target {trade?.trade?.T2}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 2st Target {trade?.trade?.T2}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 2st Target {trade?.trade?.FT2}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t3_type === 'true' ||
                              trade.FT3_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 3st Target {trade?.trade?.T3}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 3st Target {trade?.trade?.T3}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 3st Target {trade?.trade?.FT3}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t4_type === 'true' ||
                              trade.FT4_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 4th Target {trade?.trade?.T4}+
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 4th Target {trade?.trade?.T4}+
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 4th Target {trade?.trade?.FT4}+
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t5_type === 'true' ||
                              trade.FT5_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 5th Target
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 5th Target
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 5th Target
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t6_type === 'true' ||
                              trade.FT6_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 6th Target
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 6th Target
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName != undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 6th Target
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                              {trade.t7_type === 'true' ||
                              trade.FT7_type === 'true' ? (
                                <View style={styles.showView}>
                                  <View style={styles.insideViewOne}>
                                    {trade?.trade?.fnoequty_scrpt_name
                                      ?.scriptName !== undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoequty_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 7th Target
                                      </Text>
                                    ) : trade?.trade?.cash_scrpt_name
                                        ?.scriptName !== undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.cash_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 7th Target
                                      </Text>
                                    ) : trade?.trade?.fnoindex_scrpt_name
                                        ?.scriptName !== undefined ? (
                                      <Text style={styles.dropTextOne}>
                                        {
                                          trade?.trade?.fnoindex_scrpt_name
                                            ?.scriptName
                                        }{' '}
                                        @ 7th Target
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.insideViewTwo}>
                                    <Text style={styles.dropTextOne}>
                                      22-08-2022
                                    </Text>
                                  </View>
                                </View>
                              ) : null} */}
                            </CollapseBody>
                          </Collapse>
                        </View>

                        {/* <View>
                          <Text style={{color: '#000', marginVertical: 5}}>
                            SL has been Hit your trade is out
                          </Text>
                        </View> */}
                        {/* <View>
                          <Text style={{color: '#000', marginVertical: 5}}>
                            {trade?.trade?.cstmMsg}
                          </Text>
                        </View> */}
                      </CollapseBody>
                    </Collapse>
                    {/* <============Seemore=========> */}
                  </View>
                ),
              )}
            </View>

            {/* <================= Image Component Start ============> */}
            <View style={styles.listMainView}>
              {/* {imgNotify.map.length === +1 ? playPause() : null} */}
              {/* {imgNotify?.map(trade => (
                <ListItem bottomDivider key={trade._id}>
                  <View style={styles.subView}>
                    <View
                      style={
                        trade && trade.img && trade.img.length > 0
                          ? styles.imageView
                          : styles.imageView2
                      }>
                      {trade && trade.img && trade.img.length > 0 ? (
                        <Image
                          source={{uri: `${trade?.img[0]}`}}
                          style={
                            trade && trade.img && trade.img.length > 0
                              ? styles.imageGraph
                              : styles.imageGraph2
                          }
                        />
                      ) : (
                        <Text style={styles.SimpleText}>No Image found</Text>
                      )}
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.headText}>{trade?.title}</Text>
                      <RenderHTML
                        contentWidth={width}
                        tagsStyles={tagsStyles}
                        source={{html: trade?.desc}}
                      />
                      <Text style={styles.SimpleText}>{trade?.desc}</Text>
                    </View>
                  </View>
                </ListItem>
              ))} */}
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
