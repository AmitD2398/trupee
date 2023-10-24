import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axiosConfig from '../../../../axiosConfig';

const StockChart = () => {
  const [stockChart, setStockChart] = useState([]);

  useEffect(() => {
    const getChart = () => {
      axiosConfig
        .get(`/trendingchartby_type/Stock`)
        .then(response => {
          console.log(response.data.data);
          setStockChart(response.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getChart();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainView}>
          {stockChart?.map(chart => (
            <View style={styles.subView} key={chart._id}>
              <View style={styles.imageView}>
                <Image
                  source={{uri: `${chart.image}`}}
                  style={styles.imageGraph}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.headText}>{chart?.title}</Text>
                <Text style={styles.SimpleText}>{chart?.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {},
  subView: {
    margin: 10,
    backgroundColor: '#fff',
  },
  imageView: {},
  imageGraph: {
    width: '100%',
    height: 230,
  },
  textView: {
    margin: 2,
  },
  headText: {
    color: '#000',
    fontWeight: '500',
  },
  SimpleText: {
    color: '#000',
  },
});
