import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const Terms = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.head}>TERM & CONDITIONS:</Text>
          <Text style={styles.sub}>
            No guarantee is offered or implied as to the trading results.
          </Text>
          <Text style={styles.sub}>
            Any losses incurred by traders by applying these ideas or methods
            are the sole responsibility of the trader.
          </Text>
          <Text style={styles.sub}>
            By taking this service, you accept that we will not be held
            responsible for any losses in your trading.
          </Text>
          <Text style={styles.sub}>
            We are not SEBI REGISTERED analyst or an advisor.
          </Text>
          <Text style={styles.sub}>No cancellation or refund policy.</Text>
          <Text style={styles.sub}>
            Once paid an amount not refundable in any case.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: windowHeight,
    // width: windowWidth,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  head: {
    margin: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  sub: {
    color: '#000',
    marginLeft: 5,
    textAlign: 'left',
    fontWeight: '400',
    marginVertical: 3,
  },
});
