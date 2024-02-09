import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {log} from 'react-native-reanimated';

export default function AboutUs() {
  const {width} = useWindowDimensions();
  const [trans, setTrans] = useState([]);

  useEffect(() => {
    if (AsyncStorage.getItem('user-token')) {
      getTrans();
    }
  }, []);

  const getTrans = async () => {
    axios
      .get('https://crm.tradlogy.com/admin/getAbout_us', {
        headers: {
          'auth-token': await AsyncStorage.getItem('auth-token'),
        },
      })
      .then(response => {
        const trans = response.data.data;
        setTrans(trans);
        console.log('getAbout_us??', trans);
      })
      .catch(error => {
        console.log(error.response);
      });
  };
  const tagsStyles = {
    p: {color: 'red'}, // Change color for all <p> tags to red
    a: {color: 'blue'}, // Change color for all <a> tags to blue
    // Add more tag styles as needed
  };
  return (
    <View style={{flex: 1, padding: 10}}>
      <ScrollView>
        {trans?.map(item => (
          <RenderHTML
            key={item._id}
            contentWidth={width}
            tagsStyles={tagsStyles}
            source={{html: item?.desc}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
