import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeStack from './src/navigation/TabNavigator';
import OfflineNotice from './src/components/OfflineNotice';
import ForceUpdateDialog from './src/components/ForceUpdateDialog';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

let version = DeviceInfo.getVersion();
console.log(version);
function App() {
  const [modalVisible, setModalVisible] = useState(null);
  useEffect(() => {
    getUrl();
  }, []);
  const getUrl = () => {
    axios
      .get(`http://62.72.58.41:5000/api/app_setting`)
      .then(response => {
        console.log('version', response.data.data);
        setModalVisible(response.data.data.app_version);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <NavigationContainer>
      {/* <AppStack /> */}
      <HomeStack />
      <OfflineNotice />
      {modalVisible !== null && modalVisible !== version && (
        <ForceUpdateDialog />
      )}
      {/* <AuthStack /> */}
    </NavigationContainer>
  );
}

export default App;
