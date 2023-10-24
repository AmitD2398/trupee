import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
// import DatePicker from 'react-native-date-picker';
import DatePicker from 'react-native-datepicker';
function SimpleHeader({title, navigation}) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.mainView}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <TouchableOpacity>
          <Image
            style={styles.logoImg}
            resizeMode="contain"
            source={require('../Images/top-left-logo/top-left-logo1.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainView: {
    marginTop: 0,
    height: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  logoImg: {
    width: 150,
    height: 50,
    marginLeft: 10,
  },
});

export default SimpleHeader;
