// import {
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   RefreshControl,
//   Modal,
//   Pressable,
//   Alert,
// } from 'react-native';
// import PropTypes from 'prop-types';
// import React, {useState, useEffect} from 'react';
// import {styles} from './WalkStyle';
// import DatePicker from 'react-native-datepicker';
// import {TabNavigator} from '../../navigation/TabNavigator';
// import {
//   copilot,
//   walkthroughable,
//   CopilotStep,
//   CopilotText,
// } from 'react-native-copilot';

// const Walkthrough = props => {
//   var propTypes = {
//     start: PropTypes.func.isRequired,
//     copilotEvents: PropTypes.shape({
//       on: PropTypes.func.isRequired,
//     }).isRequired,
//   };
//   const [date, setDate] = useState(new Date());
//   const [allTrade, setAllTrade] = useState([]);
//   const [refreshing, setRefreshing] = React.useState(false);
//   const [secondActive, setSecondActive] = useState(true);
//   const WalkthroughableText = walkthroughable(Text);
//   const WalkthroughableImage = walkthroughable(Image);

//   useEffect(() => {
//     props.copilotEvents.on('stepChange', handleStepChange);
//     props.start();
//   }, []);

//   const handleStepChange = step => {
//     console.log(`Current step is: ${step.name}`);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <============Header========> */}
//       <View style={styles.mainView}>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//           }}>
//           <TouchableOpacity>
//             <Image
//               style={styles.logoImg}
//               source={require('../../Images/top-left-logo/top-left-logo1.png')}
//             />
//           </TouchableOpacity>
//         </View>
//         <CopilotStep
//           active={secondActive}
//           text="View Trade History for date filter"
//           order={1}
//           name="Date"
//           style={styles.walkmain}>
//           <WalkthroughableText style={styles.walkTitle}>
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <View
//                 style={{borderWidth: 2, borderColor: 'green', borderRadius: 5}}>
//                 <View style={{justifyContent: 'center', alignItems: 'center'}}>
//                   <Text style={{color: 'green'}}>Trade History</Text>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.calender}
//                   onPress={() => setOpen(true)}>
//                   <DatePicker
//                     date={date}
//                     mode="date"
//                     format="DD-MM-YYYY"
//                     minDate="2016-05-01"
//                     maxDate="2016-06-01"
//                     confirmBtnText="Confirm"
//                     cancelBtnText="Cancel"
//                     onDateChange={setDate}
//                     showIcon={true}
//                     hideText={false}
//                     customStyles={{
//                       dateIcon: {
//                         position: 'absolute',
//                         left: 0,
//                         marginRight: 10,

//                         height: 20,
//                         marginBottom: 0,
//                       },
//                       dateInput: {
//                         marginLeft: 5,
//                         borderWidth: 0,
//                         marginBottom: 5,
//                       },
//                     }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </WalkthroughableText>
//         </CopilotStep>
//       </View>

//       {/* <======================Top Tab============> */}

//       <View style={styles.demo1}>
//         <CopilotStep
//           text="View Trade History for date filter"
//           order={2}
//           name="Date"
//           style={styles.walkmain}>
//           <WalkthroughableText style={styles.walkTitle}>
//             <View>
//               <Text style={styles.demo3}>ALL TRADE</Text>
//             </View>
//             <View>
//               <Text style={styles.demo3}>FNO INDEX</Text>
//             </View>
//             <View>
//               <Text style={styles.demo3}>FNO EQUITY</Text>
//             </View>
//           </WalkthroughableText>
//         </CopilotStep>
//       </View>

//       {/* <=====================Trade Component============> */}
//       <ScrollView refreshControl={<RefreshControl refreshing={refreshing} />}>
//         <View style={{borderBottomWidth: 1}}>
//           {/* <================TOP Area=============> */}

//           <View style={styles.bgarea2}>
//             <View style={styles.botomview3}>
//               <Text style={styles.bgText}>IntraDay</Text>
//             </View>
//           </View>

//           {/* <================BUY Area=============> */}

//           <View style={styles.bgarea3}>
//             <Text style={styles.buy}>BUY</Text>
//             <Text style={styles.notbuy}>BANKNIFTY 37500CE @ 250 - 350</Text>
//           </View>

//           {/* <================Circle Area=============> */}

//           <View style={styles.bgarea2}>
//             {/* <===========SL=============> */}

//             <View style={[styles.circle1, {backgroundColor: '#fff'}]}>
//               <Text style={styles.notbuy1}>
//                 SL{'\n'}
//                 100
//               </Text>
//             </View>

//             {/* <===========T1 =============> */}

//             <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
//               <Text style={styles.notbuy}>
//                 T₹ 1{'\n'}
//                 120
//               </Text>
//             </View>

//             {/* <===========T2 =============> */}

//             <View style={[styles.circle, {backgroundColor: '#66bb6a'}]}>
//               <Text style={styles.notbuy}>
//                 T₹ 2{'\n'}
//                 140
//               </Text>
//             </View>

//             {/* <===========T3 =============> */}

//             <View style={[styles.circle, {backgroundColor: '#fff'}]}>
//               <Text style={styles.notbuy}>
//                 T₹ 3{'\n'}
//                 160
//               </Text>
//             </View>

//             {/* <===========T4 =============> */}

//             <View style={[styles.circle, {backgroundColor: '#fff'}]}>
//               <Text style={styles.notbuy}>
//                 T₹ 4{'\n'}
//                 180
//               </Text>
//             </View>
//           </View>

//           {/* <================Botton Area=============> */}
//           <View style={styles.bgarea2}>
//             <View style={styles.botomview1}>
//               <Text style={styles.bottomText}>
//                 Quantity & investment Amount
//               </Text>
//               <Text style={styles.bottomText1}>100 Lots(10 Qty) = ₹ 1000</Text>
//             </View>
//             <View style={styles.botomview2}>
//               <Text style={styles.bottomText}>P&L</Text>

//               <Text style={[styles.bottomText1, , {color: 'green'}]}>
//                 ₹ 100 | 10%
//               </Text>
//             </View>
//           </View>

//           {/* <================ Date and Show more=============> */}
//           <View style={styles.bgarea2}>
//             <View style={styles.botomview3}>
//               <Text style={styles.dateText}>Sep 22 2022 10:00</Text>
//             </View>
//           </View>
//           {/* <============Seemore=========> */}
//           <View>
//             <ShowMore
//               height={0}
//               buttonColor={'blue'}
//               showMoreText="View Trade History"
//               showLessText="Hide Trade History">
//               <View style={styles.showView}>
//                 <View style={styles.insideViewOne}>
//                   <Text style={styles.dropTextOne}>
//                     BANKNIFTY 37500CE @ 250 - 350
//                   </Text>
//                 </View>
//                 <View style={styles.insideViewTwo}>
//                   <Text style={styles.dropTextOne}>22-08-2022</Text>
//                 </View>
//               </View>
//               <View style={styles.showView}>
//                 <View style={styles.insideViewOne}>
//                   <Text style={styles.dropTextOne}>
//                     BANKNIFTY 37500CE @ 250 - 350
//                   </Text>
//                 </View>
//                 <View style={styles.insideViewTwo}>
//                   <Text style={styles.dropTextOne}>22-08-2022</Text>
//                 </View>
//               </View>
//               <View style={styles.showView}>
//                 <View style={styles.insideViewOne}>
//                   <Text style={styles.dropTextOne}>
//                     BANKNIFTY 37500CE @ 250 - 350
//                   </Text>
//                 </View>
//                 <View style={styles.insideViewTwo}>
//                   <Text style={styles.dropTextOne}>22-08-2022</Text>
//                 </View>
//               </View>
//             </ShowMore>
//           </View>
//         </View>
//       </ScrollView>
//       {/* <=====================Bottom Tab================> */}
//       <View style={styles.demo1}>
//         <View>
//           <Image
//             source={require('../../Images/Icons/home-colour-icon1.png')}
//             style={styles.demoImage}
//           />
//         </View>
//         <View>
//           <Image
//             source={require('../../Images/Icons/service-plan-icon1.png')}
//             style={styles.demoImage}
//           />
//         </View>
//         <View>
//           <Image
//             source={require('../../Images/Icons/explore-icon1.png')}
//             style={styles.demoImage}
//           />
//         </View>
//         <View>
//           <Image
//             source={require('../../Images/Icons/notification-icon1.png')}
//             style={styles.demoImage}
//           />
//         </View>
//         <View>
//           <Image
//             source={require('../../Images/Icons/profile-icon1.png')}
//             style={styles.demoImage}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default copilot({
//   animated: true, // Can be true or false
//   overlay: 'svg', // Can be either view or svg
// })(Walkthrough);

import {View, Text} from 'react-native';
import React from 'react';

export default function Walkthrough() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: '#000'}}>Walkthrough</Text>
    </View>
  );
}
