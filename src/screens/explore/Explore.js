import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import SimpleHeader from '../../components/SimpleHeader';

const Explore = ({navigation}) => {
  return (
    <SafeAreaView style={{}}>
      <View>
        <SimpleHeader />
      </View>
      <View>
        <ImageBackground
          source={require('../../Images/explore/colorbg.png')}
          style={styles.colorImage}>
          <ScrollView>
            <View style={styles.aaa}>
              <View style={styles.bbb}>
                <TouchableOpacity
                  style={styles.ccc}
                  onPress={() => navigation.navigate('Startup')}>
                  <ImageBackground
                    source={require('../../Images/explore/start-up-tab1.png')}
                    style={styles.exploreImg}>
                    <View style={styles.ccc1}>
                      <Text style={styles.ccctext}>Start Up</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ddd}
                  onPress={() => navigation.navigate('University')}>
                  <ImageBackground
                    source={require('../../Images/explore/trupee-library-tab1.png')}
                    style={styles.exploreImg}>
                    <View style={styles.ccc1}>
                      <Text style={styles.ccctext}>tradlogy University</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <View style={styles.bbb}>
                <TouchableOpacity
                  style={styles.ccc}
                  onPress={() => navigation.navigate('Performance Sheet')}>
                  <ImageBackground
                    source={require('../../Images/explore/performance-sheet-tab1.png')}
                    style={styles.exploreImg}>
                    <View style={styles.ccc1}>
                      <Text style={styles.ccctext}>Performance Sheet</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ddd}
                  onPress={() => navigation.navigate('ReferEarn')}>
                  <ImageBackground
                    source={require('../../Images/explore/refer-earn-tab1.png')}
                    style={styles.exploreImg}>
                    <View style={styles.ccc1}>
                      <Text style={styles.ccctext}>Refer & Earn</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <View style={styles.bbb}>
                <TouchableOpacity
                  style={styles.ccc}
                  onPress={() => navigation.navigate('Opportunity')}>
                  <ImageBackground
                    source={require('../../Images/explore/opportunity-tab1.png')}
                    style={styles.exploreImg}>
                    <View style={styles.ccc1}>
                      <Text style={styles.ccctext}>Opportunity</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ddd}
                  onPress={() => navigation.navigate('Charts')}>
                  <ImageBackground
                    source={require('../../Images/explore/treading-viw-chart-tab1.png')}
                    style={styles.exploreImg}>
                    <View style={styles.ccc1}>
                      <Text style={styles.ccctext}>Trading View Charts</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <View style={styles.bbb}>
                <Text style={styles.exploreText}>
                  A reliable platform for small and short term investors
                </Text>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  colorImage: {
    width: '100%',
    height: '100%',
  },
  exploreImg: {
    height: 150,
    width: 150,
    margin: 5,
  },
  aaa: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  bbb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ccc: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  ddd: {justifyContent: 'center', alignItems: 'center', elevation: 10},
  ccc1: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 10,
  },
  ccctext: {
    fontWeight: '700',
    color: '#000',
  },

  exploreText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 15,
  },
});
