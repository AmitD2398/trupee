import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListItem} from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
// import NotifyHeader from './header/NotifyHeader';

export default function Trasaction({navigation}) {
  const [trans, setTrans] = useState([]);

  const getTrans = async () => {
    axios
      .get('https://crm.tradlogy.com/admin/UsermembershipPayment', {
        headers: {
          'auth-token': await AsyncStorage.getItem('auth-token'),
        },
      })
      .then(response => {
        const trans = response.data.data;
        setTrans(trans);
        // console.log('trans??', trans);
      })
      .catch(error => {
        console.log(error.response);
      });
  };
  useEffect(() => {
    if (AsyncStorage.getItem('user-token')) {
      getTrans();
    }
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {trans.map(transList => (
            <ListItem bottomDivider margin={5} key={transList?._id}>
              <Icon name="money" color="blue" size={25} />
              <ListItem.Content>
                <ListItem.Title style={{color: 'black', fontSize: 13}}>
                  Transaction ID : {transList?._id}
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: 'black',
                    fontSize: 13,
                    margin: 3,
                    fontWeight: '600',
                  }}>
                  Amount: {transList?.planId?.des_price}
                </ListItem.Subtitle>
                <ListItem.Subtitle
                  style={{
                    color: 'black',
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  Date : {transList?.date}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  transation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B008B',
  },
  transText: {
    color: 'white',
    fontSize: 25,
  },
});
