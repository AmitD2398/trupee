import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const error_icon = require('../Images/error.webp');
const internet_connect = require('../Images/internet_connect.gif');
export default function OfflineNotice({
  onClick = () => {},
  icon = error_icon,
  title = '',
  description = '',
  buttonText = 'OK',
}) {
  const netInfo = useNetInfo();
  // console.log('log net info ---  isInternetReachable = ',netInfo.isInternetReachable)

  if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
      <View style={[styles.wrapper]}>
        <View style={[styles.cardBox]}>
          <View style={styles.boxContent}>
            <Image
              source={icon}
              resizeMode="contain"
              style={{width: 70, height: 70}}
            />
            <Text style={styles.title}>Error!</Text>
            <Text style={styles.description}>
              Looks like you do not have an active internet connection.
            </Text>
            <Image
              source={internet_connect}
              resizeMode="contain"
              style={{width: 80, height: 50}}
            />

            {/* <TouchableOpacity onPress={() => onClick()} style={[global.button, global.button_alert, global.button_shadow, global.button_width_full]}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    backgroundColor: '#12242990',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(10),
  },
  cardBox: {
    minHeight: 100,
    width: wp(80),
    borderWidth: 1,
    borderColor: '#122429',
    backgroundColor: '#122429',
    shadowColor: '#75716b',
    shadowOffset: {width: -0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    borderRadius: 10,
  },
  boxContent: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Roboto-Regular',
    color: '#eee',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 6,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    color: '#eee',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 0,
  },
  button: {
    backgroundColor: '#646bcf',
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#eee',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
});
