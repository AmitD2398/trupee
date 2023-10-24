import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

const ForceUpdateDialog = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Modal
      isVisible={visible}
      style={styles.modalContainer}
      swipeDirection={'down'}
      onBackButtonPress={() => {
        setVisible(true);
      }}>
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Image
            source={require('../Images/setting.png')}
            style={styles.logoStyle}
          />
          <Text style={styles.title}>Update App</Text>
          <Text style={styles.message}>
            A new version of the app is available. Please update to continue
            using the app.
          </Text>
          <View style={styles.topLogo1}>
            <TouchableOpacity
              style={styles.touchButton}
              onPress={() =>
                Platform.OS === 'ios'
                  ? Linking.openURL(
                      'https://play.google.com/store/apps/details?id=com.tradzoo.app&',
                    )
                  : Linking.openURL(
                      'https://play.google.com/store/apps/details?id=com.tradzoo.app&',
                    )
              }>
              <Text style={styles.buttontext}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLogo1: {
    alignItems: 'center',
    marginVertical: 10,
  },
  touchButton: {
    backgroundColor: '#00b050',
    paddingHorizontal: 80,
    paddingVertical: 18,
    borderRadius: 20,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 32,
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,

    color: 'red',
  },
  logoStyle: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  modalContainer: {},
};

export default ForceUpdateDialog;
