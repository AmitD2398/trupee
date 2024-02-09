import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';

const ForegroundHandler = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      console.log('handle in foreground', remoteMessage);
      const {notification, messageId} = remoteMessage;

      if (Platform.OS == 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          body: notification.body,
          title: notification.title,
          sound: 'default',
        });
      } else {
        PushNotification.localNotification({
          channelId: '566100600971',
          id: messageId,
          body: 'android body',
          title: 'android notif title',
          soundName: 'ring_bell.wav',
          vibrate: true,
          channelName: 'tradlogy',
          importance: Importance.HIGH,
        });
      }
    });
    return unsubscribe;
  }, []);
  return null;
};

export default ForegroundHandler;
