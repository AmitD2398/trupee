import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeStack from './src/navigation/TabNavigator';
import messaging from '@react-native-firebase/messaging';
import {
  getToken,
  notificationListenr,
  requestUserPermission,
} from './src/utils/commonUtils';
import {Alert} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import OfflineNotice from './src/components/OfflineNotice';
import ForceUpdateDialog from './src/components/ForceUpdateDialog';
import DeviceInfo from 'react-native-device-info';

PushNotification.createChannel(
  ///for Local Push Notification
  {
    channelId: '422681026042', // (required)
    channelName: 'trupee', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  //  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

let version = DeviceInfo.getVersion();
function App() {
  const [modalVisible, setModalVisible] = useState(null);
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMeaaage => {
      console.log('Message handled in the background!', remoteMeaaage);
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        // channelId:remoteMessage.notification.android.channelId,
        channelId: true,
        vibrate: true,
      });
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
    notificationListenr();
    getToken();
  }, []);
  return (
    <NavigationContainer>
      {/* <AppStack /> */}
      <HomeStack />
      {/* <AuthStack /> */}
      <OfflineNotice />
      {modalVisible !== null && modalVisible !== version && (
        <ForceUpdateDialog />
      )}
    </NavigationContainer>
  );
}

export default App;
