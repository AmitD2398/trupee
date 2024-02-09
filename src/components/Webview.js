import React, {useEffect, useRef} from 'react';
import {ToastAndroid, Alert} from 'react-native';
import axios from 'axios';
import WebView from 'react-native-webview';

const Webview = ({navigation, route}) => {
  const webViewRef = useRef(null);
  // const url = navigation.getParam('url');
  const {url} = route.params;
  console.log('url', url);
  const onNavigationChange = webViewState => {
    const hitUrl = webViewState.url;
    console.log('Current URL:', hitUrl);

    if (hitUrl.includes('http://www.example.com/?payment_id=')) {
      // Extract payment_req_id from the URL
      const payment_final_id = hitUrl.split('payment_request_id=').pop();
      console.log('payment_final_id', payment_final_id);

      const response = {
        url: hitUrl,
        payment_final_id: payment_final_id,
      };

      ToastAndroid.show(
        'Success \n' + JSON.stringify(response),
        ToastAndroid.SHORT,
      );

      console.log('Success////',JSON.stringify(response));


      getPaymentDetails(payment_final_id);
    }
  };

  const getPaymentDetails = payment_final_id => {
    ToastAndroid.show('Getting transaction status', ToastAndroid.SHORT);

    axios
      .get(`https://www.instamojo.com/api/1.1/payment-requests/${payment_final_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'b7582c5b8e16d99a6b1fd165c15a0dbe',
          'X-Auth-Token': '623440849b453f66fcc352780111efc6',
        },
      })
      .then(function (response) {
        console.log('response<><?', response);
        Alert.alert('Response of txn', JSON.stringify(response.data));
        navigation.navigate('SERVICES', {payment_final_id: response?.data});
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
        ToastAndroid.show('Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    // componentDidMount logic
    if (url) {
      webViewRef.current.injectJavaScript(`window.location.href = '${url}';`);
    }
  }, [url]);

  return (
    <WebView
      ref={webViewRef}
      source={{uri: url}}
      onNavigationStateChange={onNavigationChange}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  );
};

export default Webview;
