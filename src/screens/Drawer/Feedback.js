import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import axiosConfig from '../../../axiosConfig';

// create a component
const Feedback = () => {
  const selectedId = '';
  const [desc, setDesc] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [sample, setSample] = useState([
    {id: '1', name: 'Feedback'},
    {id: '2', name: 'Report Bug'},
  ]);

  const onSelect = item => {
    const selectedId = item.name;
    if (selectedId === item.name) setSelectedItem(item.name);
    else setSelectedItem(null);
    console.log('@@@', selectedId);
  };

  const postData = async () => {
    console.log(desc, selectedItem);
    axiosConfig
      .post(
        `/addFeedback`,
        {title: selectedItem, desc: desc},
        {headers: {'auth-token': await AsyncStorage.getItem('auth-token')}},
      )
      .then(response => {
        console.log(response.data);
        setSelectedItem();
        setDesc();
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.txt}>General Support & Feedback</Text>
        <View style={styles.btnRow}>
          {sample.map(item => (
            <View key={item.id}>
              <TouchableOpacity
                style={[styles.btn]}
                onPress={() => onSelect(item)}>
                <Text
                  style={
                    item.name === selectedItem ? styles.btnTxt : styles.btnTxt1
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{marginTop: 20}}>
          <TextInput
            style={[
              styles.input,
              {height: 150, paddingVertical: 10, textAlignVertical: 'top'},
            ]}
            placeholder={'Your feedback here'}
            color={'#333'}
            placeholderTextColor={'#333'}
            multiline={true}
            value={desc}
            onChangeText={setDesc}
          />
        </View>
        <View style={{marginTop: 10}}>
          <Text style={styles.txtBotoom}>
            if you have someting to say that does not fit here,please send us an
            email at <Text style={{color: 'blue'}}>support@trupee.com</Text>
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={styles.touchSubmit} onPress={postData}>
            <Text style={styles.submitText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  txt: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    display: 'flex',
    marginTop: 15,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#333',
    width: 100,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: '500',
    color: 'green',
  },
  btnTxt1: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  txtBotoom: {
    color: 'black',
    fontSize: 15,
  },
  touchSubmit: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

//make this component available to the app
export default Feedback;
