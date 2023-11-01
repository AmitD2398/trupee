/**
 * @format
 */
import * as React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import messaging from '@react-native-firebase/messaging';

export default function index() {
  RNPreventScreenshot.enabled(true);
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  return <App />;
}

AppRegistry.registerComponent(appName, () => index);
