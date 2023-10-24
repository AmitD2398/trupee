import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeStack from './src/navigation/TabNavigator';
import OfflineNotice from './src/components/OfflineNotice';
import ForceUpdateDialog from './src/components/ForceUpdateDialog';

function App() {
  const [modalVisible, setModalVisible] = useState(null);
  return (
    <NavigationContainer>
      {/* <AppStack /> */}
      <HomeStack />
      <OfflineNotice />
      {modalVisible !== null && <ForceUpdateDialog />}
      {/* <AuthStack /> */}
    </NavigationContainer>
  );
}

export default App;
