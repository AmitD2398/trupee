import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    } else {
      console.log('User denied permission');
      // Handle denial (e.g., show a message to the user)
    }
  } catch (error) {
    console.log('Error requesting permission:', error);
    // Handle the error (e.g., show an error message)
  }
}

const getFcmToken = async () => {
  try {
    let checkToken = await AsyncStorage.getItem('fcmToken');
    console.log('the old token', checkToken);
    if (!checkToken) {
      const fcmToken = await messaging().getToken();
      if (!!fcmToken) {
        console.log('fcm token generated', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  } catch (error) {
    console.log('Error getting or saving FCM token:', error);
    alert(error?.message);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    console.log('backgrund state', remoteMessage.notification);
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        console.log('remote message', remoteMessage.notification);
      }
    });
  messaging().onMessage(async remoteMessage => {
    console.log('notification on forground state,,,,,', remoteMessage);
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};
