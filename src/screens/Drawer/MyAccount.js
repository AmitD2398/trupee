import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {TextInput} from 'react-native-paper';

const MyAccount = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [fNameValidError, setFNameValidError] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailValidError, setEmailValidError] = useState('');
  const [mobile, setMobile] = useState();
  const [gender, setGender] = useState('male');
  const [userId, setUserId] = useState('');

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
  // <===========Text Validation=========>
  const handleFirstName = val => {
    let reg = /^(?:[A-Za-z]+|\d+)$/;
    if (val.length === 0) {
      setFNameValidError('Enter Name');
      console.log(fNameValidError);
    } else if (reg.test(val) === false) {
      setFNameValidError('Enter Valid Name');
      console.log(fNameValidError);
    } else if (reg.test(val) === true) {
      setFNameValidError('');
    }
  };

  const getUser = async () => {
    axios
      .get(`http://62.72.58.41:5000/user/viewoneuser`, {
        headers: {'auth-token': await AsyncStorage.getItem('auth-token')},
      })
      .then(response => {
        console.log(response.data.data);
        setFirstName(response.data.data.firstname);
        setLastName(response.data.data.lastname);
        setGender(response.data.data.gender);
        setEmail(response.data.data.email);
        setDate(response.data.data.dob);
        setMobile(JSON.stringify(response.data.data.mobile));
        setUserId(response.data.data._id);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUser();
  }, []);

  const editProfile = async () => {
    console.log(firstName, lastName, email, mobile, gender, date);
    axios
      .post(
        `http://62.72.58.41:5000/user/myprofile`,
        {
          firstname: firstName,
          lastname: lastName,
          gender: gender,
          dob: date,
          email: email,
          mobile: mobile,
        },
        {headers: {'auth-token': await AsyncStorage.getItem('auth-token')}},
      )
      .then(response => {
        console.log(response.data);
        navigation.replace('My Account');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 0}}>
        <View style={styles.main}>
          <View style={styles.mainView}>
            <Ionicons name="md-person" color="green" size={25} />
            <TextInput
              label="FirstName"
              outlineColor="green"
              mode="outlined"
              value={firstName}
              onChangeText={value => {
                setFirstName(value);
                handleFirstName(value);
              }}
              keyboardType="default"
              style={[styles.tfield, {width: 120}]}
            />
            <TextInput
              label="LastName"
              outlineColor="green"
              mode="outlined"
              onChangeText={setLastName}
              value={lastName}
              keyboardType="default"
              style={[styles.tfield, {width: 120}]}
            />
          </View>
          <View style={{marginLeft: 25}}>
            {fNameValidError ? (
              <Text style={{color: 'red'}}>{fNameValidError}</Text>
            ) : null}
          </View>

          <View style={styles.mainView}>
            <Ionicons name="ios-people" color="green" size={25} />
            <Picker
              style={[styles.tfield, {width: 250}]}
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}>
              <Picker.Item label="Male" value="male" style={{color: '#000'}} />
              <Picker.Item
                label="Female"
                value="female"
                style={{color: '#000'}}
              />
              <Picker.Item
                label="Other"
                value="other"
                style={{color: '#000'}}
              />
            </Picker>
          </View>

          <View style={styles.mainView}>
            <Ionicons name="md-calendar" color="green" size={25} />
            <Text style={{color: '#000'}}>Date Of Birth</Text>
            <DatePicker
              style={[styles.tfield, {width: 150}]}
              showIcon={false}
              date={date}
              mode="date"
              placeholder="Enter Date of Birth"
              format="DD-MM-YYYY"
              maxDate={date}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateInput: {
                  marginLeft: 10,
                },
              }}
              onDateChange={setDate}
            />
          </View>

          <View style={styles.mainView}>
            <Ionicons name="md-mail" color="green" size={25} />
            <TextInput
              style={[styles.tfield, {width: 250}]}
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
          <View style={{marginLeft: 25}}>
            {emailValidError ? (
              <Text style={{color: 'red'}}>{emailValidError}</Text>
            ) : null}
          </View>

          <View style={styles.mainView}>
            <Ionicons name="md-call" color="green" size={25} />
            <TextInput
              style={[styles.tfield, {width: 250}]}
              label="Mobile"
              outlineColor="green"
              mode="outlined"
              onChangeText={setMobile}
              value={mobile}
              keyboardType="default"
              editable={false}
            />
          </View>
          {fNameValidError === '' && emailValidError === '' ? (
            <TouchableOpacity style={styles.touch} onPress={editProfile}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  main: {
    marginTop: 50,
  },
  mainView1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tfield: {
    borderWidth: 0,
    borderColor: '#000',
    borderRadius: 10,
    margin: 5,
    marginVertical: 15,
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    backgroundColor: 'green',
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 20,
  },
});
