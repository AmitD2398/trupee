import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
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
      .get(`http://62.72.58.41:5000/admin/serviceslist`)
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
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.head}>Premium / paid Services included:</Text>
          {data?.map(item => (
            <View
              style={{flexDirection: 'row', alignItems: 'center'}}
              key={item._id}>
              <View>
                <Text style={styles.sub}>✔</Text>
              </View>
              <View>
                {console.log(item?.planId?.desc)}
                {/* <Text style={styles.sub}>{item?.planId?.desc}</Text> */}
                <RenderHtml
                  key={item._id}
                  contentWidth={width}
                  tagsStyles={tagsStyles}
                  source={{html: item?.desc}}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PremiumPaid;

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    height: windowHeight,
    //width: windowWidth,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  head: {
    margin: 5,
    color: 'purple',
    fontWeight: 'bold',
  },
  sub: {
    color: '#000',
    textAlign: 'left',
    fontWeight: '500',
    marginHorizontal: 5,
    marginRight: 10,
  },
  subsub: {
    marginLeft: 25,
    color: '#000',
  },
});
