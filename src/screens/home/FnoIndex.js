import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axiosConfig from '../../../axiosConfig';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

const FnoIndex = ({extraData}) => {
  let allDate = extraData;
  const [allTrade, setAllTrade] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [expFreeMem, setExpFreeMem] = useState('');

  var fDate = moment(Date()).format('DD-MM-YYYY');
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
        console.log('setExpFreeMem', response.data.data.is_paid);
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
      .get(`/AppindexList`)
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

  // //  <============ All Teafe Get Api ===========>
  // const getTrade = () => {
  //   setRefreshing(true);
  //   axiosConfig
  //     .get(`/AppindexList`)
  //     .then(response => {
  //       //console.log(response.data.data);
  //       setAllTrade(response.data.data);
  //       setRefreshing(false);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   getTrade();
  // }, []);
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
          expFreeMem === '1' || expFreeMem === '3' ? (
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
                      This Trade will be visible after 30 minutes. Upgrade to
                      our premium service to view this instantly.
                    </Text>
                  </View>
                </View>
                <View style={styles.bgarea2}>
                  <View style={styles.botomview1}>
                    <Text style={styles.bottomText}>
                      Quantity & Total Points
                    </Text>
                    <Text style={styles.bottomText1}>
                      {trade?.no_of_lots} Lots(
                      {trade?.qty * trade?.no_of_lots} Qty) = 
                      {trade?.investment_amt}
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
              </View>
            ) : trade.type === 'Index' ? (
              <View style={{borderBottomWidth: 1}} key={trade._id}>
                {/* <================TOP Area=============> */}

                <View style={styles.bgarea2}>
                  <View style={styles.botomview3}>
                    <Text style={styles.bgText}>{trade.call_type}</Text>
                  </View>
                </View>

                {/* <================BUY Area=============> */}

                <View style={styles.bgarea3}>
                  <Text style={styles.buy}>{trade?.script_type}</Text>
                  <Text style={styles.notbuy}>
                    {trade?.fnoindex_scrpt_name?.scriptName} @{' '}
                    {trade?.active_value} - {trade?.active_value2}
                  </Text>
                </View>

                {/* <================Circle Area=============> */}

                {/* <View style={styles.bgarea2}>
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
                  style={{color: '#fff', textAlign: 'center', fontSize: 14}}>
                  This Trade will be visible after 30 minutes. Upgrade to our
                  premium service to view this instantly.
                </Text>
              </View>
            </View> */}
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

                  {trade?.trl_type === 'false' ? (
                    <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                      <Text style={styles.notbuy}>
                        TRL{'\n'}
                        {trade?.trl}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                      <Text style={styles.notbuy}>
                        TRL{'\n'}
                        {trade?.trl}
                      </Text>
                    </View>
                  )}

                  {trade?.FT1_type === 'false' ? (
                    <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                      <Text style={styles.notbuy}>
                        T 1{'\n'}
                        {trade?.FT1}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                      <Text style={styles.notbuy}>
                        T 1{'\n'}
                        {trade?.FT1}
                      </Text>
                    </View>
                  )}

                  {trade?.FT2_type === 'false' ? (
                    <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                      <Text style={styles.notbuy}>
                        T 2{'\n'}
                        {trade?.FT2}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                      <Text style={styles.notbuy}>
                        T 2{'\n'}
                        {trade?.FT2}
                      </Text>
                    </View>
                  )}

                  {trade?.FT3_type === 'false' ? (
                    <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                      <Text style={styles.notbuy}>
                        T 3{'\n'}
                        {trade?.FT3}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                      <Text style={styles.notbuy}>
                        T 3{'\n'}
                        {trade?.FT3}
                      </Text>
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
                      {trade?.no_of_lots} Lots({trade?.qty * trade?.no_of_lots}{' '}
                      Qty) = {trade?.investment_amt}
                    </Text>
                  </View>
                  <View style={styles.botomview2}>
                    <Text style={styles.bottomText}>Probability</Text>
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
                      <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
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
                            {trade?.fnoindex_scrpt_name?.scriptName} SL EXIT
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.slTime}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.trl_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} TRL{' '}
                            {trade?.trl}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.trlTime}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT1_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 1st
                            Target {trade?.FT1}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT1time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT2_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 2nd
                            Target {trade?.FT2}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT2time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT3_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 3rd
                            Target {trade?.FT3}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT3time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT4_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 4th
                            Target {trade?.FT4}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT4time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT5_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 5th
                            Target {trade?.FT5}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT5time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT6_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 6th
                            Target {trade?.FT6}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT6time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT7_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 7th
                            Target {trade?.FT7}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT7time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null} */}
                    </CollapseBody>
                  </Collapse>
                </View>
              </View>
            ) : null
          ) : trade.type === 'Index' ? (
            <View style={{borderBottomWidth: 1}} key={trade._id}>
              {/* <================TOP Area=============> */}

              <View style={styles.bgarea2}>
                <View style={styles.botomview3}>
                  <Text style={styles.bgText}>{trade.call_type}</Text>
                </View>
              </View>

              {/* <================BUY Area=============> */}

              <View style={styles.bgarea3}>
                <Text style={styles.buy}>{trade?.script_type}</Text>
                <Text style={styles.notbuy}>
                  {trade?.fnoindex_scrpt_name?.scriptName} @{' '}
                  {trade?.active_value} - {trade?.active_value2}
                </Text>
              </View>

              {/* <================Circle Area=============> */}

              {/* <View style={styles.bgarea2}>
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
                  style={{color: '#fff', textAlign: 'center', fontSize: 14}}>
                  This Trade will be visible after 30 minutes. Upgrade to our
                  premium service to view this instantly.
                </Text>
              </View>
            </View> */}
              <View style={styles.bgarea2}>
                {trade?.sl_type === 'false' ? (
                  <View style={[styles.circle1, {backgroundColor: '#fff'}]}>
                    <Text style={styles.notbuy1}>
                      SL{'\n'}
                      {trade?.SL}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.circle1, {backgroundColor: '#ef9a9a'}]}>
                    <Text style={styles.notbuy1}>
                      SL{'\n'}
                      {trade?.SL}
                    </Text>
                  </View>
                )}

                {trade?.trl_type === 'false' ? (
                  <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                    <Text style={styles.notbuy}>
                      TRL{'\n'}
                      {trade?.trl}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                    <Text style={styles.notbuy}>
                      TRL{'\n'}
                      {trade?.trl}
                    </Text>
                  </View>
                )}

                {trade?.FT1_type === 'false' ? (
                  <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                    <Text style={styles.notbuy}>
                      T 1{'\n'}
                      {trade?.FT1}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                    <Text style={styles.notbuy}>
                      T 1{'\n'}
                      {trade?.FT1}
                    </Text>
                  </View>
                )}

                {trade?.FT2_type === 'false' ? (
                  <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                    <Text style={styles.notbuy}>
                      T 2{'\n'}
                      {trade?.FT2}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                    <Text style={styles.notbuy}>
                      T 2{'\n'}
                      {trade?.FT2}
                    </Text>
                  </View>
                )}

                {trade?.FT3_type === 'false' ? (
                  <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                    <Text style={styles.notbuy}>
                      T 3{'\n'}
                      {trade?.FT3}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                    <Text style={styles.notbuy}>
                      T 3{'\n'}
                      {trade?.FT3}
                    </Text>
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
                    {trade?.no_of_lots} Lots({trade?.qty * trade?.no_of_lots}{' '}
                    Qty) = {trade?.investment_amt}
                  </Text>
                </View>
                <View style={styles.botomview2}>
                  <Text style={styles.bottomText}>Probability</Text>
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
                    <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
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
                            {trade?.fnoindex_scrpt_name?.scriptName} SL EXIT
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.slTime}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.trl_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} TRL{' '}
                            {trade?.trl}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.trlTime}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT1_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 1st
                            Target {trade?.FT1}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT1time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT2_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 2nd
                            Target {trade?.FT2}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT2time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT3_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 3rd
                            Target {trade?.FT3}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT3time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT4_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 4th
                            Target {trade?.FT4}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT4time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT5_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 5th
                            Target {trade?.FT5}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT5time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT6_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 6th
                            Target {trade?.FT6}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT6time}
                            </Moment>
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    {trade?.FT7_type === 'true' ? (
                      <View style={styles.showView}>
                        <View style={styles.insideViewOne}>
                          <Text style={styles.dropTextOne}>
                            {trade?.fnoindex_scrpt_name?.scriptName} @ 7th
                            Target {trade?.FT7}+
                          </Text>
                        </View>
                        <View style={styles.insideViewTwo}>
                          <Text style={styles.dropTextOne}>
                            <Moment element={Text} format="DD-MM-YYYY HH:mm:ss">
                              {trade?.FT7time}
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

export default FnoIndex;
