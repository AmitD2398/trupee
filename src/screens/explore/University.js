import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import axiosConfig from '../../../axiosConfig';

const University = () => {
  const [playing, setPlaying] = useState(false);
  const [videoData, setVideoData] = useState([]);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  useEffect(() => {
    const getData = () => {
      axiosConfig
        .get(`/get_Tuniversity`)
        .then(response => {
          console.log(response.data.data);
          setVideoData(response.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          {videoData.map(item => (
            <View style={styles.mainView} key={item._id}>
              <View>
                <YoutubePlayer
                  height={200}
                  play={playing}
                  videoId={item.video_link}
                  onChangeState={onStateChange}
                />
              </View>
              <View style={styles.centerText}>
                <Text style={styles.textCenter}>{item?.title}</Text>
              </View>
              <View>
                <Text style={styles.rightText}>{item?.desc}</Text>
                {/* <Text style={styles.rightText}>
                  Chart Pattern: Falling wedge Pattern
                </Text>
                <Text style={styles.rightText}>Time Frame: 1D</Text>
                <Text style={styles.rightText}>BreakOut Entry : @53-54+</Text> */}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default University;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    marginHorizontal: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  centerText: {
    alignItems: 'center',
    margin: 5,
  },
  textCenter: {
    color: '#000',
    fontWeight: '600',
  },
  rightText: {
    color: '#000',
  },
});
