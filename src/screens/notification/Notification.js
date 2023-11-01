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
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayProfit, setTodayProfit] = useState({});
  const [weeklyProfit, setWeeklyProfit] = useState({});
  const [monthlyProfit, setMonthlyProfit] = useState({});
  const {width} = useWindowDimensions();
  const tagsStyles = {
    p: {color: 'red'}, // Change color for all <p> tags to red
    a: {color: 'blue'}, // Change color for all <a> tags to blue
    // Add more tag styles as needed
  };

  useEffect(() => {
    ding.setVolume(1);
    return () => {
      ding.release();
    };
  }, []);
  useEffect(() => {
    getNotify();
    getImgNotify();
    getTodayProfit();
    getWeeklyProfit();
    getMonthlyProfit();
  }, []);
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
      .get(`http://62.72.58.41:5000/admin/today_profit_loss`)
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
      .get(`http://62.72.58.41:5000/admin/weekely_profit_loss`)
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
      .get(`http://62.72.58.41:5000/admin/monthly_profit_loss`)
      .then(response => {
        console.log(response.data);
        setMonthlyProfit(response.data);
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

    fetch('http://62.72.58.41:5000/admin/addPnlsheet', {
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
    axiosConfig
      .get(`/get_notification`)
      .then(response => {
        const notify = response.data.data;
        setImgNotify(notify);
        console.log(notify);
        //playPause();
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  const getNotify = async () => {
    axiosConfig
      .get(`/notificationList`)
      .then(response => {
        const notify = response.data.data;
        setNotify(notify);
        //console.log(notify);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

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
                <Text style={styles.tradeText}>Today's P&L</Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {todayProfit?.total_prft_loss < 0 ? (
                  <Text style={[styles.tradeText1, {color: 'red'}]}>
                    ₹ {tabDate}
                  </Text>
                ) : (
                  <Text style={[styles.tradeText1, {color: 'green'}]}>
                    ₹ {todayProfit?.total_prft_loss}
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
                  <Text style={styles.tradeText2}>
                    Total Performance | Trade History
                  </Text>
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
                    <Text style={styles.modalText}>Profit & Loss</Text>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Text style={styles.modalText}>Today</Text>
                        {todayProfit?.total_prft_loss < 0 ? (
                          <Text style={[styles.modalText1, {color: 'red'}]}>
                            ₹ {todayProfit?.total_prft_loss}
                          </Text>
                        ) : (
                          <Text style={[styles.modalText1, {color: 'green'}]}>
                            ₹ {todayProfit?.total_prft_loss}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.modalText}>Weekly</Text>
                        {weeklyProfit?.weekly_profit_loss < 0 ? (
                          <Text style={[styles.modalText1, {color: 'red'}]}>
                            ₹ {weeklyProfit?.weekly_profit_loss}
                          </Text>
                        ) : (
                          <Text style={[styles.modalText1, {color: 'green'}]}>
                            ₹ {weeklyProfit?.weekly_profit_loss}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.modalText}>Monthly</Text>
                        {monthlyProfit?.thirtydays_prft_loss < 0 ? (
                          <Text style={[styles.modalText1, {color: 'red'}]}>
                            ₹ {monthlyProfit?.thirtydays_prft_loss}
                          </Text>
                        ) : (
                          <Text style={[styles.modalText1, {color: 'green'}]}>
                            ₹ {monthlyProfit?.thirtydays_prft_loss}
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
                  Upload your P&L Screenshot
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
              {notify?.map(trade => (
                <View style={{borderBottomWidth: 1}}>
                  <View style={styles.bgarea2}>
                    <View style={styles.botomview3}>
                      <Text style={styles.bgText}>{trade?.call_type}</Text>
                    </View>
                  </View>

                  <View style={styles.bgarea3}>
                    <View>
                      <Text style={styles.buy}>{trade?.script_type}</Text>
                    </View>
                    {trade?.fnoequty_scrpt_name?.scriptName != '' &&
                    trade?.fnoequty_scrpt_name?.scriptName != undefined &&
                    trade?.fnoequty_scrpt_name?.scriptName != null ? (
                      <View>
                        <Text style={styles.notbuy}>
                          {trade?.fnoequty_scrpt_name?.scriptName} @{' '}
                          {trade?.active_value} - {trade?.active_value2}
                        </Text>
                      </View>
                    ) : trade?.cash_scrpt_name?.scriptName != '' &&
                      trade?.cash_scrpt_name?.scriptName != undefined &&
                      trade?.cash_scrpt_name?.scriptName != null ? (
                      <View>
                        <Text style={styles.notbuy}>
                          {trade?.cash_scrpt_name?.scriptName} @{' '}
                          {trade?.active_value} - {trade?.active_value2}
                        </Text>
                      </View>
                    ) : trade?.fnoindex_scrpt_name?.scriptName != '' &&
                      trade?.fnoindex_scrpt_name?.scriptName != undefined &&
                      trade?.fnoindex_scrpt_name?.scriptName != null ? (
                      <View>
                        <Text style={styles.notbuy}>
                          {trade?.fnoindex_scrpt_name?.scriptName} @{' '}
                          {trade?.active_value} - {trade?.active_value2}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* <===========SL=============> */}
                  <View style={styles.bgarea2}>
                    {trade?.sl_type === 'false' ? (
                      <View style={[styles.circle1, {backgroundColor: '#fff'}]}>
                        <Text style={styles.notbuy1}>
                          SL{'\n'}
                          {trade?.SL}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[styles.circle1, {backgroundColor: '#ef9a9a'}]}>
                        <Text style={styles.notbuy1}>
                          SL{'\n'}
                          {trade?.SL}
                        </Text>
                      </View>
                    )}
                    {/* <===========T1 =============> */}
                    {trade?.trl != '' &&
                    trade?.trl != null &&
                    trade?.trl != undefined ? (
                      <View>
                        {trade?.trl_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              TRL{'\n'}
                              {trade?.trl}
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
                              {trade?.trl}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        {trade?.t1_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 1{'\n'}
                              {trade?.T1}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 1{'\n'}
                              {trade?.T1}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* <===========T2 =============> */}

                    {trade?.FT1 != '' &&
                    trade?.FT1 != null &&
                    trade?.FT1 != undefined ? (
                      <View>
                        {trade?.FT1_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 1{'\n'}
                              {trade?.FT1}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 1{'\n'}
                              {trade?.FT1}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        {trade?.t2_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 2{'\n'}
                              {trade?.T2}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 2{'\n'}
                              {trade?.T2}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* <===========T3 =============> */}

                    {trade?.FT2 != '' &&
                    trade?.FT2 != null &&
                    trade?.FT2 != undefined ? (
                      <View>
                        {trade?.FT2_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 2{'\n'}
                              {trade?.FT2}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 2{'\n'}
                              {trade?.FT2}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        {trade?.t3_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 3{'\n'}
                              {trade?.T3}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 3{'\n'}
                              {trade?.T3}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* <===========T4 =============> */}

                    {trade?.FT3 != '' &&
                    trade?.FT3 != null &&
                    trade?.FT3 != undefined ? (
                      <View>
                        {trade?.FT3_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 3{'\n'}
                              {trade?.FT3}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 3{'\n'}
                              {trade?.FT3}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        {trade?.t4_type === 'false' ? (
                          <View
                            style={[styles.circle, {backgroundColor: '#fff'}]}>
                            <Text style={styles.notbuy}>
                              T₹ 4{'\n'}
                              {trade?.T4}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              {backgroundColor: '#66bb6a'},
                            ]}>
                            <Text style={styles.notbuy}>
                              T₹ 4{'\n'}
                              {trade?.T4}
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
                        Quantity & investment Amount
                      </Text>
                      <Text style={styles.bottomText1}>
                        {trade?.no_of_lots} Lots({trade?.qty} Qty) = ₹
                        {trade?.investment_amt}
                      </Text>
                    </View>
                    <View style={styles.botomview2}>
                      <Text style={styles.bottomText}>P&L</Text>
                      {trade.pl < 0 ? (
                        <Text style={[styles.bottomText1, , {color: 'red'}]}>
                          ₹ {trade?.pl} | {trade?.pl_per}%
                        </Text>
                      ) : (
                        <Text style={[styles.bottomText1, , {color: 'green'}]}>
                          ₹ {trade?.pl} | {trade?.pl_per}%
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* <================ Date and Show more=============> */}
                  <View style={styles.bgarea2}>
                    <View style={styles.botomview3}>
                      <Text style={styles.dateText}>
                        <Moment element={Text} format="lll">
                          {trade.createdAt}
                        </Moment>
                      </Text>
                    </View>
                  </View>
                  {/* <============Seemore=========> */}
                  <View>
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
                              {trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 1st
                                  Target {trade?.T1}+
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 1st
                                  Target {trade?.T1}+
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 1st
                                  Target {trade?.FT1}+
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              {trade?.FT1time !== '' ? (
                                <Text style={styles.dropTextOne}>
                                  <Moment element={Text} format="llll">
                                    {trade?.FT1time}
                                  </Moment>
                                </Text>
                              ) : (
                                <Text style={styles.dropTextOne}>
                                  <Moment element={Text} format="lll">
                                    {trade?.T1time}
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
                              {trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 2st
                                  Target {trade?.T2}+
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 2st
                                  Target {trade?.T2}+
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 2st
                                  Target {trade?.FT2}+
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              <Text style={styles.dropTextOne}>22-08-2022</Text>
                            </View>
                          </View>
                        ) : null}
                        {trade.t3_type === 'true' ||
                        trade.FT3_type === 'true' ? (
                          <View style={styles.showView}>
                            <View style={styles.insideViewOne}>
                              {trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 3st
                                  Target {trade?.T3}+
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 3st
                                  Target {trade?.T3}+
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 3st
                                  Target {trade?.FT3}+
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              <Text style={styles.dropTextOne}>22-08-2022</Text>
                            </View>
                          </View>
                        ) : null}
                        {trade.t4_type === 'true' ||
                        trade.FT4_type === 'true' ? (
                          <View style={styles.showView}>
                            <View style={styles.insideViewOne}>
                              {trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 4th
                                  Target {trade?.T4}+
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 4th
                                  Target {trade?.T4}+
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 4th
                                  Target {trade?.FT4}+
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              <Text style={styles.dropTextOne}>22-08-2022</Text>
                            </View>
                          </View>
                        ) : null}
                        {trade.t5_type === 'true' ||
                        trade.FT5_type === 'true' ? (
                          <View style={styles.showView}>
                            <View style={styles.insideViewOne}>
                              {trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 5th
                                  Target
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 5th
                                  Target
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 5th
                                  Target
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              <Text style={styles.dropTextOne}>22-08-2022</Text>
                            </View>
                          </View>
                        ) : null}
                        {trade.t6_type === 'true' ||
                        trade.FT6_type === 'true' ? (
                          <View style={styles.showView}>
                            <View style={styles.insideViewOne}>
                              {trade?.fnoequty_scrpt_name?.scriptName !=
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 6th
                                  Target
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 6th
                                  Target
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !=
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 6th
                                  Target
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              <Text style={styles.dropTextOne}>22-08-2022</Text>
                            </View>
                          </View>
                        ) : null}
                        {trade.t7_type === 'true' ||
                        trade.FT7_type === 'true' ? (
                          <View style={styles.showView}>
                            <View style={styles.insideViewOne}>
                              {trade?.fnoequty_scrpt_name?.scriptName !==
                              undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoequty_scrpt_name?.scriptName} @ 7th
                                  Target
                                </Text>
                              ) : trade?.cash_scrpt_name?.scriptName !==
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.cash_scrpt_name?.scriptName} @ 7th
                                  Target
                                </Text>
                              ) : trade?.fnoindex_scrpt_name?.scriptName !==
                                undefined ? (
                                <Text style={styles.dropTextOne}>
                                  {trade?.fnoindex_scrpt_name?.scriptName} @ 7th
                                  Target
                                </Text>
                              ) : null}
                            </View>
                            <View style={styles.insideViewTwo}>
                              <Text style={styles.dropTextOne}>22-08-2022</Text>
                            </View>
                          </View>
                        ) : null}
                      </CollapseBody>
                    </Collapse>
                  </View>

                  <View>
                    <Text style={{color: '#000', marginVertical: 5}}>
                      SL has been Hit your trade is out
                    </Text>
                  </View>
                  <View>
                    <Text style={{color: '#000', marginVertical: 5}}>
                      {trade?.cstmMsg}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* <================= Image Component Start ============> */}
            <View style={styles.listMainView}>
              {imgNotify.map.length === +1 ? playPause() : null}
              {imgNotify?.map(trade => (
                <ListItem bottomDivider key={trade._id}>
                  <View style={styles.subView}>
                    <View style={styles.imageView}>
                      <Image
                        source={{uri: `${trade?.img[0]}`}}
                        style={styles.imageGraph}
                      />
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.headText}>{trade?.title}</Text>
                      <RenderHTML
                        contentWidth={width}
                        tagsStyles={tagsStyles}
                        source={{html: trade?.desc}}
                      />
                      {/* <Text style={styles.SimpleText}>{trade?.desc}</Text> */}
                    </View>
                  </View>
                </ListItem>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
