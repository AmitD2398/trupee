import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';

const PremiumPaid = () => {
  const {width} = useWindowDimensions();
  const [data, setData] = useState([]);
  useEffect(() => {
    getTodayProfit();
  }, []);
  const getTodayProfit = () => {
    axios
      .get(`https://crm.tradlogy.com/admin/serviceslist`)
      .then(response => {
        console.log('????', response.data);
        setData(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const tagsStyles = {
    p: {color: '#333'}, // Change color for all <p> tags to red
    a: {color: '#333'}, // Change color for all <a> tags to blue
    // Add more tag styles as needed
  };
  console.log('response??', data);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.head}>Premium / paid Services included:</Text>
          {data?.map(item => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
              }}
              key={item._id}>
              <RenderHtml
                key={item._id}
                contentWidth={width}
                tagsStyles={tagsStyles}
                source={{html: item?.desc}}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumPaid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    margin: 5,
    color: 'purple',
    fontWeight: 'bold',
  },
  sub: {
    color: '#000',
  },
  subsub: {
    marginLeft: 25,
    color: '#000',
  },
});
