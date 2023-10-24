import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import {useEffect} from 'react';
import {useState} from 'react';

export default function NotificationAlert() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getTodayProfit();
  }, []);
  const getTodayProfit = () => {
    axios
      .get(`http://62.72.58.41:5000/user/appNotification_alert`)
      .then(response => {
        console.log('<>>>', response.data);
        setData(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.txtStyle}>Notification</Text>
        </View>
        <View style={styles.headerBox}>
          <Text style={styles.txtStyle}>History</Text>
          <Text style={styles.txtStyle}>25 Aug</Text>
        </View>
      </View>
      {/* hr line */}
      <View style={styles.hrlineStyle}></View>
      <ScrollView style={{padding: 10}}>
        {data?.map(item => (
          <View>
            <View key={item._id}>
              <View style={{margin: 5}}>
                <Text style={styles.txt}>{item.cstmMsg}</Text>
                <Text style={[styles.txt, {marginVertical: 5}]}>
                  Click Here
                </Text>
                <Text style={[styles.txt, {color: '#d3d3d3'}]}>
                  {item.createdAt}
                </Text>
              </View>
              <View style={styles.hrlineStyle}></View>
            </View>

            <View style={{padding: 5}}>
              <TouchableOpacity style={styles.sortBtnStyle}>
                <Text style={{color: '#fff'}}>{item.call_type}</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    backgroundColor: '#d3d3d3',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  {item.script_type}
                </Text>
                <Text style={{color: '#333', fontSize: 16, fontWeight: '600'}}>
                  {item.scriptName}
                </Text>
              </View>
              <View style={styles.showTradeStyle}>
                <View style={styles.tradeBtn}>
                  <Text style={styles.txt}>SL</Text>
                  <Text style={styles.txt}>{item.SL}</Text>
                </View>
                <View style={styles.tradeBtn}>
                  <Text style={styles.txt}>T1</Text>
                  <Text style={styles.txt}>{item.FT1}</Text>
                </View>
                <View style={styles.tradeBtn}>
                  <Text style={styles.txt}>T2</Text>
                  <Text style={styles.txt}>{item.FT2}</Text>
                </View>
                <View style={styles.tradeBtn}>
                  <Text style={styles.txt}>T3</Text>
                  <Text style={styles.txt}>{item.FT3}</Text>
                </View>
                {/* <View style={styles.tradeBtn}>
                  <Text style={styles.txt}>T4</Text>
                  <Text style={styles.txt}>{item.FT4}</Text>
                </View> */}
              </View>
              <View style={styles.showTradeStyle}>
                <Text style={styles.txt}>Investment Qty & Amount</Text>
                <Text style={styles.txt}>P&L</Text>
              </View>
              <View style={[styles.showTradeStyle, {marginVertical: 5}]}>
                <Text style={styles.txt}>
                  {item.investment_amt} Qty | ₹ {item.qty}
                </Text>
                <Text style={styles.txt}>---</Text>
              </View>
              <Text style={[styles.txt, {color: '#d3d3d3'}]}>
                {item.createdAt}
              </Text>
            </View>
            {/* hr line */}
            <View style={styles.hrlineStyle}></View>
            <View style={{margin: 5}}>
              <Text style={styles.txt}>{item.trade_type}</Text>
              <View style={styles.showTradeStyle}>
                <Text style={[styles.txt, {color: '#d3d3d3'}]}>
                  25-08-2023 04:34:09 PM
                </Text>
                <Text style={[styles.txt, {marginVertical: 5}]}>
                  Show Trade
                </Text>
              </View>
            </View>
            {/* hr line */}
            <View style={styles.hrlineStyle}></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
  txtStyle: {
    color: '#333',
    fontSize: 16,
  },
  headerBox: {
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#d3d3d3',
  },
  hrlineStyle: {
    borderBottomWidth: 1,
    marginTop: 5,
    borderColor: '#d3d3d3',
  },
  txt: {
    color: '#333',
    fontWeight: '800',
  },
  showTradeStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortBtnStyle: {
    backgroundColor: 'blue',
    width: 100,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tradeBtn: {
    padding: 5,
    backgroundColor: '#d3d3d3',
    width: 50,
    height: 50,
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
