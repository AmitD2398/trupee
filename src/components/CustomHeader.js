import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
// import DatePicker from 'react-native-date-picker';
import DatePicker from 'react-native-datepicker';
function CustomHeader({title, navigation}) {
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

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{borderWidth: 2, borderColor: 'green', borderRadius: 5}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'green'}}>Trade History</Text>
          </View>
          <TouchableOpacity
            style={styles.calender}
            onPress={() => setOpen(true)}>
            <DatePicker
              open={open}
              date={date}
              mode="date"
              format="DD-MM-YYYY"
              // minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={setDate}
              showIcon={true}
              hideText={false}
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  marginRight: 10,

                  height: 20,
                  marginBottom: 0,
                },
                dateInput: {
                  marginLeft: 5,
                  borderWidth: 0,
                  marginBottom: 5,
                },
              }}
            />
            <View>
              <TouchableOpacity>
                <View style={styles.calenderStyle}>
                  <Image
                    source={require('../Images/Icons/top-calander-colour-icon1.png')}
                    style={styles.calenderImage}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <View style={styles.calenderStyle}>
                <Text style={styles.calenderText}>Trade History</Text>
                <Text style={styles.calenderText}>10-02-2022</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    marginTop: 0,
    height: 100,
    backgroundColor: '#FFF',
    elevation: 10,
  },
  logoImg: {
    width: 150,
    height: 50,
    marginLeft: 10,
  },
  calenderStyle: {
    borderColor: '#00b050',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  calenderImage: {
    height: 25,
    width: 30,
  },
  calenderText: {
    color: '#000',
  },
  calender: {
    borderWidth: 0,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomHeader;
