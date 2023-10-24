import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
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

  var fDate = moment(Date()).format('DD-MM-YYYY');
  //console.log('@@@@', fDate);
  //  <============ 30 SEC dily POST Api ===========>
  useEffect(() => {
    dilyApi();
  }, []);

  const dilyApi = async () => {
    axios
      .get(`http://62.72.58.41:5000/user/viewoneuser`, {
        headers: {
          'auth-token': await AsyncStorage.getItem('auth-token'),
        },
      })
      .then(response => {
        console.log(response.data.data);
        setExpFreeMem(response.data.data.exp_free_mem);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //  <============ Filter Trade Get Api ===========>

  const getFilterTrade = () => {
    //console.log('aaa', allDate);
    axiosConfig
      .get(`/dateSrchFltr/${allDate}`)
      .then(response => {
        //console.log('filter', response.data.data);
        setAllTrade(response.data.data);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error.response);
      });
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getTrade} />
        }>
        {allTrade?.map(trade => (
          <View style={{borderBottomWidth: 1}} key={trade._id}>
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
                {trade?.cash_scrpt_name?.scriptName} @ {trade?.active_value} -{' '}
                {trade?.active_value2}
              </Text>
            </View>

            {/* <================Circle Area=============> */}

            {/* <View style={styles.bgarea2}>

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

              {trade?.t1_type === 'false' ? (
                <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 1{'\n'}
                    {trade?.T1}
                  </Text>
                </View>
              ) : (
                <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 1{'\n'}
                    {trade?.T1}
                  </Text>
                </View>
              )}


              {trade?.t2_type === 'false' ? (
                <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 2{'\n'}
                    {trade?.T2}
                  </Text>
                </View>
              ) : (
                <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 2{'\n'}
                    {trade?.T2}
                  </Text>
                </View>
              )}


              {trade?.t3_type === 'false' ? (
                <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 3{'\n'}
                    {trade?.T3}
                  </Text>
                </View>
              ) : (
                <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 3{'\n'}
                    {trade?.T3}
                  </Text>
                </View>
              )}

              

              {trade?.t4_type === 'false' ? (
                <View style={[styles.circle, {backgroundColor: '#fff'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 4{'\n'}
                    {trade?.T4}
                  </Text>
                </View>
              ) : (
                <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
                  <Text style={styles.notbuy}>
                    T₹ 4{'\n'}
                    {trade?.T4}
                  </Text>
                </View>
              )}
            </View> */}
            {expFreeMem ? (
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
                    style={{color: '#fff', textAlign: 'center', fontSize: 14}}>
                    This Trade will be visible after 30 minutes. Upgrade to our
                    premium service to view this instantly.
                  </Text>
                </View>
              </View>
            ) : null}

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
                {trade?.sl_type === 'true' ? (
                  <Text style={[styles.bottomText1, , {color: 'red'}]}>
                    ₹ {trade?.loss} | {trade?.loss_per}%
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
                    <Text style={{color: 'blue'}}>View Trade History</Text>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  {trade?.sl_type === 'true' ? (
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
                  ) : null}
                </CollapseBody>
              </Collapse>
            </View>
          </View>
        ))}
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
