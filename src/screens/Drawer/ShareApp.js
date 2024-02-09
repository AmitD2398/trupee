import React, {useState, useEffect} from 'react';
import {Share, View, Button} from 'react-native';

const ShareApp = () => {
  const [refId, setRefId] = useState('');
  useEffect(() => {
    const getUser = async () => {
      axios
        .get(`https://crm.tradlogy.com/user/viewoneuser`, {
          headers: {
            'auth-token': await AsyncStorage.getItem('auth-token'),
          },
        })
        .then(response => {
          console.log('name', response.data.data.refral_Code);
          const user = response.data.data.refral_Code;
          setRefId(user);
        })
        .catch(error => {
          console.log(error);
        });
    };

    getUser();
  }, []);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native dsdsdsdsdsdsdsdsd| A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={{marginTop: 50}}>
      <Button onPress={onShare} title="Share" />
    </View>
  );
};

export default ShareApp;
