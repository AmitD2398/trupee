import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axiosConfig from '../../../axiosConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import moment from 'moment';
import {styles} from './TradeStyle';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EquityCash = ({extraData}) => {
  let allDate = extraData;
  const [allTrade, setAllTrade] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [expFreeMem, setExpFreeMem] = useState('');
  const [allTime, setAllTime] = useState('');
  var fDate = moment(Date()).format('DD-MM-YYYY');
  //  <============ 30 SEC dily POST Api ===========>
  useEffect(() => {
    dilyApi();
  }, []);

  useEffect(() => {
    // Call the function to check the time difference for each trade
    checkTimeDifference();
  }, [allTrade]);

  const checkTimeDifference = () => {
    // Check if allTrade is not null or undefined
    if (allTrade && Array.isArray(allTrade)) {
      // Iterate through all trades and check the time difference
      const updatedTrades = allTrade.map(trade => {
        const createdAtTime = moment(trade.createdAt);
        const timeOnly = createdAtTime.format('HH:mm:ss');
        const currentTime = moment(new Date());
        const currentTimeOnly = currentTime.format('HH:mm:ss');
        const timeDifference = currentTime.diff(createdAtTime, 'minutes');

        if (timeDifference > 30) {
          setAllTime(timeDifference > 30);
        }

        return trade;
      });
    }
  };

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

  //  <============ Filter Trade Get Api ===========>

  const getFilterTrade = async () => {
    try {
      const authToken = await AsyncStorage.getItem('auth-token');

      if (!authToken) {
        // Handle the case where the auth token is not available
        return;
      }
      console.log('authToken', authToken);
      console.log('aaa', allDate);
      axios
        .get(`https://crm.tradlogy.com/admin/dateSrchFltr/${allDate}`, {
          headers: {'auth-token': await AsyncStorage.getItem('auth-token')},
        })
        .then(response => {
          console.log('filter', response.data.data);
          setAllTrade(response.data.data);
          setRefreshing(false);
        })
        .catch(error => {
          console.log(error.response);
        });
    } catch (error) {
      console.error('Error retrieving auth token from AsyncStorage:', error);
    }
  };

  const getTrade = () => {
    axiosConfig
      .get(`/AppCashList`)
      .then(response => {
        //console.log('no filter', response.data.data);
        setAllTrade(response.data.data);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (allDate === fDate) {
      getTrade();
    } else {
      getFilterTrade();
    }
  }, [allTrade, getFilterTrade]);
  // console.log('allTrade', allTrade[0]?.delay_tym);
  return (
    <ImageBackground
      source={require('../../Images/Background/bgImg.png')}
      style={styles.container}>
      {allTrade !== null && allTrade?.length == 0 && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '55%',
          }}>
          <Image
            source={require('../../../src/assets/no_data_found.png')}
            resizeMode={'contain'}
            style={{height: 75, width: 75, tintColor: '#333'}}
          />
          <Text style={[styles.no_recored_found_text]}>No data found</Text>
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getTrade} />
        }>
        {allTrade?.map(trade =>
          trade.type === 'Cash' ? (
            <View style={{borderBottomWidth: 1}} key={trade._id}>
              {/* <================Circle Area=============> */}

              {expFreeMem === '1' || expFreeMem === '3' ? (
                new Date().getTime() - new Date(trade.createdAt).getTime() <=
                30 * 60 * 1000 ? (
                  <View>
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
                          <Text style={styles.notbuy}>XXXX XXX - XXX</Text>
                        </View>
                      ) : trade?.cash_scrpt_name?.scriptName != '' &&
                        trade?.cash_scrpt_name?.scriptName != undefined &&
                        trade?.cash_scrpt_name?.scriptName != null ? (
                        <View>
                          <Text style={styles.notbuy}>XXXX XXX - XXX</Text>
                        </View>
                      ) : trade?.fnoindex_scrpt_name?.scriptName != '' &&
                        trade?.fnoindex_scrpt_name?.scriptName != undefined &&
                        trade?.fnoindex_scrpt_name?.scriptName != null ? (
                        <View>
                          <Text style={styles.notbuy}>XXXX XXX - XXX</Text>
                        </View>
                      ) : null}
                    </View>
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
                  </View>
                ) : (
                  <View>
                    {/* <================TOP Area=============> */}

                    <View style={styles.bgarea2}>
                      <View style={styles.botomview3}>
                        <Text style={styles.bgText}>{trade?.call_type}</Text>
                      </View>
                    </View>

                    {/* <================BUY Area=============> */}

                    <View style={styles.bgarea3}>
                      <Text style={styles.buy}>{trade?.script_type}</Text>
                      <Text style={styles.notbuy}>
                        {trade?.cash_scrpt_name?.scriptName} @{' '}
                        {trade?.active_value} - {trade?.active_value2}
                      </Text>
                    </View>
                    <View style={styles.bgarea2}>
                      {trade?.sl_type === 'false' ? (
                        <View
                          style={[styles.circle1, {backgroundColor: '#fff'}]}>
                          <Text style={styles.notbuy1}>
                            SL{'\n'}
                            {trade?.SL}
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
                            {trade?.SL}
                          </Text>
                        </View>
                      )}

                      {trade?.t1_type === 'false' ? (
                        <View
                          style={[styles.circle, {backgroundColor: '#fff'}]}>
                          <Text style={styles.notbuy}>
                            T 1{'\n'}
                            {trade?.T1}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                          <Text style={styles.notbuy}>
                            T 1{'\n'}
                            {trade?.T1}
                          </Text>
                        </View>
                      )}

                      {trade?.t2_type === 'false' ? (
                        <View
                          style={[styles.circle, {backgroundColor: '#fff'}]}>
                          <Text style={styles.notbuy}>
                            T 2{'\n'}
                            {trade?.T2}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                          <Text style={styles.notbuy}>
                            T 2{'\n'}
                            {trade?.T2}
                          </Text>
                        </View>
                      )}

                      {trade?.t3_type === 'false' ? (
                        <View
                          style={[styles.circle, {backgroundColor: '#fff'}]}>
                          <Text style={styles.notbuy}>
                            T 3{'\n'}
                            {trade?.T3}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                          <Text style={styles.notbuy}>
                            T 3{'\n'}
                            {trade?.T3}
                          </Text>
                        </View>
                      )}

                      {trade?.t4_type === 'false' ? (
                        <View
                          style={[styles.circle, {backgroundColor: '#fff'}]}>
                          <Text style={styles.notbuy}>
                            T 4{'\n'}
                            {trade?.T4}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                          <Text style={styles.notbuy}>
                            T 4{'\n'}
                            {trade?.T4}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              ) : (
                <View>
                  {/* <================TOP Area=============> */}

                  <View style={styles.bgarea2}>
                    <View style={styles.botomview3}>
                      <Text style={styles.bgText}>{trade?.call_type}</Text>
                    </View>
                  </View>

                  {/* <================BUY Area=============> */}

                  <View style={styles.bgarea3}>
                    <Text style={styles.buy}>{trade?.script_type}</Text>
                    <Text style={styles.notbuy}>
                      {trade?.cash_scrpt_name?.scriptName} @{' '}
                      {trade?.active_value} - {trade?.active_value2}
                    </Text>
                  </View>
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

                    {trade?.t1_type === 'false' ? (
                      <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                        <Text style={styles.notbuy}>
                          T 1{'\n'}
                          {trade?.T1}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                        <Text style={styles.notbuy}>
                          T 1{'\n'}
                          {trade?.T1}
                        </Text>
                      </View>
                    )}

                    {trade?.t2_type === 'false' ? (
                      <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                        <Text style={styles.notbuy}>
                          T 2{'\n'}
                          {trade?.T2}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                        <Text style={styles.notbuy}>
                          T 2{'\n'}
                          {trade?.T2}
                        </Text>
                      </View>
                    )}

                    {trade?.t3_type === 'false' ? (
                      <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                        <Text style={styles.notbuy}>
                          T 3{'\n'}
                          {trade?.T3}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                        <Text style={styles.notbuy}>
                          T 3{'\n'}
                          {trade?.T3}
                        </Text>
                      </View>
                    )}

                    {trade?.t4_type === 'false' ? (
                      <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                        <Text style={styles.notbuy}>
                          T 4{'\n'}
                          {trade?.T4}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                        <Text style={styles.notbuy}>
                          T 4{'\n'}
                          {trade?.T4}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* <================Botton Area=============> */}
              <View style={styles.bgarea2}>
                <View style={styles.botomview1}>
                  <Text style={styles.bottomText}>
                    Quantity & Total Points
                  </Text>
                  <Text style={styles.bottomText1}>
                    ({trade?.qty} Qty) = {trade?.investment_amt}
                  </Text>
                </View>
                <View style={styles.botomview2}>
                  <Text style={styles.bottomText1}>Probability</Text>
                  {trade?.sl_type === 'true' ? (
                    <Text style={[styles.bottomText1, , {color: 'red'}]}>
                       {trade?.loss} | {trade?.loss_per}%
                    </Text>
                  ) : (
                    <Text style={[styles.bottomText1, , {color: 'green'}]}>
                       {trade?.pl} | {trade?.pl_per}%
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
                    {trade &&
                    trade.alerthistory &&
                    trade.alerthistory.length > 0 ? (
                      <View style={{margin: 5}}>
                        <Text style={{color: '#a82682'}}>
                          View Trade History
                        </Text>
                      </View>
                    ) : null}
                  </CollapseHeader>
                  <CollapseBody>
                    <View style={styles.showView}>
                      <View style={styles.insideViewOne}>
                        {trade &&
                        trade.alerthistory &&
                        trade.alerthistory.length > 0 ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                width: '75%',
                                justifyContent: 'space-between',
                              }}>
                              {trade.alerthistory.map((alert, index) => (
                                <Text
                                  key={index}
                                  style={[
                                    styles.dropTextOne,
                                    {marginVertical: 5},
                                  ]}>
                                  {alert.alert_message}
                                </Text>
                              ))}
                            </View>
                            <View
                              style={{
                                width: '20%',
                                justifyContent: 'space-between',
                              }}>
                              {trade.alerthistory.map((alert, index) => (
                                <Text
                                  key={index}
                                  style={[
                                    styles.dropTextOne,
                                    {marginVertical: 5},
                                  ]}>
                                  <Moment
                                    element={Text}
                                    format="DD-MM-YYYY hh:mm:ss A">
                                    {alert.createdAt}
                                  </Moment>
                                </Text>
                              ))}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    {/* {trade?.sl_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} SL EXIT
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.slTime}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t1_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 1st Target{' '}
                            {trade?.T1}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T1time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t2_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 2nd Target{' '}
                            {trade?.T2}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T2time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t3_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 3rd Target{' '}
                            {trade?.T3}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T3time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t4_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 4th Target{' '}
                            {trade?.T4}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T4time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t5_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 5th Target{' '}
                            {trade?.T5}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T5time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t6_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 6th Target{' '}
                            {trade?.T6}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T6time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.t7_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.cash_scrpt_name?.scriptName} @ 7th Target{' '}
                            {trade?.T7}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="llll">
                              {trade?.T7time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null} */}
                  </CollapseBody>
                </Collapse>
              </View>
            </View>
          ) : null,
        )}
        <View style={styles.refreshView}>
          <TouchableOpacity
            style={styles.refreshTouch}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getTrade} />
            }>
            <Text style={styles.refreshText}>REFRESH</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default EquityCash;
