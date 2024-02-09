import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatGrid} from 'react-native-super-grid';
import {Text, TextInput} from 'react-native-paper';
import axiosConfig from '../../../axiosConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PerformanceSheet = () => {
  const [email, setEmail] = React.useState('');
  const [emailValidError, setEmailValidError] = useState('');
  const [items, setItems] = React.useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedId, setSelectedId] = useState('');

  // <============= Email Validation ==============>
  const handleValidEmail = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (val.length === 0) {
      setEmailValidError('Email Address must be Enter');
    } else if (reg.test(val) === false) {
      setEmailValidError('Enter valid Email Address');
    } else if (reg.test(val) === true) {
      setEmailValidError('');
    }
  };

  // <=============Performance get Api ============>
  useEffect(() => {
    getDate();
  }, []);
  const getDate = () => {
    axiosConfig(`/getPerSheet`)
      .then(response => {
        const items = response.data.data;
        setItems(items);
        console.log(items);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Post api
  const postData = async () => {
    console.log(email, selectedItem);
    axios
      .post(
        `https://crm.tradlogy.com/user/ad_user_persheet`,
        {
          email: email,
          plan: selectedItem,
        },
        {headers: {'auth-token': await AsyncStorage.getItem('auth-token')}},
      )
      .then(response => {
        console.log(response.data);
        setEmail();
        setSelectedItem();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSelection = _id => {
    const selectedId = _id;
    if (selectedId === _id) setSelectedItem(_id);
    else setSelectedItem(null);
    console.log('@@@', selectedId);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.section}>
            <TouchableOpacity style={styles.touchtop}>
              <Text
                variant="displayMedium"
                style={{color: '#fff', marginBottom: 8}}>
                Download Monthly Performance sheet and track our entire trade
                calls historty
              </Text>
              <Text variant="bodyLarge" style={{color: '#fff'}}>
                History Seperate According to
              </Text>
              <Text
                variant="headlineLarge"
                style={{color: '#fff', marginBottom: 5}}>
                Index FNO | Equity FNO | Equity Cash calls
              </Text>
              <Text
                variant="headlineLarge"
                style={{color: '#fff', marginBottom: 5}}>
                Get Entire of all the trades for a particular month
              </Text>
              <Text
                variant="headlineLarge"
                style={{color: '#fff', marginBottom: 5}}>
                Trade results calculated considering even if you exit your
                entire position on first target
              </Text>
              <Text
                variant="headlineLarge"
                style={{color: '#fff', marginBottom: 5}}>
                Track Monthly minimum average returns through our calls
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <View>
              <Text style={styles.listHeading}>Get Monthly Performance of</Text>
            </View>
            <ScrollView horizontal={true}>
              <FlatGrid
                maxItemsPerRow={2}
                itemDimension={110}
                data={items}
                extraData={selectedId}
                style={styles.gridView}
                staticDimension={350}
                spacing={8}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSelection(item._id)}
                    style={
                      item._id === selectedItem
                        ? styles.itemContainer
                        : styles.itemContainer2
                    }>
                    <Text style={styles.itemName}>
                      {item?.month}, {item?.year}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.itemPrice}>{item.dst_price}</Text>
                      <Text style={styles.itemPriceOff}>{item.mrp}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
          <View style={styles.section}>
            <View>
              <Text style={styles.listHeading}>Send Performance Sheet on</Text>
            </View>
            <View>
              <TextInput
                style={[styles.tfield, {width: 300}]}
                label="Email"
                outlineColor="green"
                mode="outlined"
                value={email}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => {
                  setEmail(value);
                  handleValidEmail(value);
                }}
              />
            </View>
            <View>
              {emailValidError ? (
                <Text style={{color: 'red'}}>{emailValidError}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.section1}>
            <TouchableOpacity style={styles.touchButton} onPress={postData}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PerformanceSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 8,
  },
  section: {
    margin: 0,
  },

  touchtop: {
    backgroundColor: 'purple',
    padding: 5,
    borderRadius: 10,
  },
  listHeading: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
    marginVertical: 10,
  },
  gridView: {
    margin: 0,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
    height: 60,
    borderWidth: 3,
    borderColor: 'purple',
  },
  itemContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
    height: 60,
    borderWidth: 2,
    borderColor: '#bdc3c7',
  },
  itemName: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    margin: 2,
  },
  itemPriceOff: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000',
    margin: 2,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  tfield: {
    borderWidth: 0,

    borderRadius: 10,
    marginVertical: 0,
  },
  section1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    margin: 15,
  },
  touchButton: {},
  buttonText: {
    backgroundColor: 'purple',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 35,
    fontWeight: '700',
    borderRadius: 10,
  },
});
