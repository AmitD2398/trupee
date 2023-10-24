import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {Image, StyleSheet} from 'react-native';
import Services from '../screens/services/Services';
import Explore from '../screens/explore/Explore';
import Notification from '../screens/notification/Notification';
import Profile from '../screens/profile/Profile';
import FirstScreen from '../screens/firstScreen/FirstScreen';
import MyAccount from '../screens/Drawer/MyAccount';
import Trasaction from '../screens/Drawer/Trasaction';
import Walkthrough from '../screens/Drawer/Walkthrough';
import Faqs from '../screens/Drawer/Faqs';
import Feedback from '../screens/Drawer/Feedback';
import Appreciation from '../screens/Drawer/Appreciation';
import RateUs from '../screens/Drawer/RateUs';
import ShareApp from '../screens/Drawer/ShareApp';
import Startup from '../screens/explore/Startup';
import University from '../screens/explore/University';
import ReferEarn from '../screens/explore/ReferEarn';
import Charts from '../screens/explore/charts/Charts';
import PerformanceSheet from '../screens/explore/PerformanceSheet';
import AfterSignUp from '../screens/AfterSignUp';
import Opportunity from '../screens/explore/Opportunity';
import PremiumPaid from '../screens/services/PremiumPaid';
import Terms from '../screens/services/Terms';
import MemberPlan from '../screens/services/MemberPlan';
import EnterRefer from '../screens/Drawer/EnterRefer';
import NotificationAlert from '../screens/notification/NotificationAlert';
import AboutUs from '../screens/profile/AboutUs';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);
  return (
    <Stack.Navigator>
      {showSplash ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
      ) : null}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AfterSignUp"
        component={AfterSignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MemberPlan"
        component={MemberPlan}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FirstScreen"
        component={FirstScreen}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />

      <Stack.Screen
        name="Startup"
        component={Startup}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="University"
        component={University}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Performance Sheet"
        component={PerformanceSheet}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="ReferEarn"
        component={ReferEarn}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Opportunity"
        component={Opportunity}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Charts"
        component={Charts}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="My Account"
        component={MyAccount}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Transaction History"
        component={Trasaction}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="App Walkthrough"
        component={Walkthrough}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Premium Service"
        component={PremiumPaid}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Frequently Asked Questions"
        component={Faqs}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Terms & Conditions"
        component={Terms}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Feedback / Report Bugs"
        component={Feedback}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Show Appreciation"
        component={Appreciation}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Enter Refer"
        component={EnterRefer}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Rate Us"
        component={RateUs}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="Share App"
        component={ShareApp}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="NotificationAlert"
        component={NotificationAlert}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
      <Stack.Screen
        name="About Us"
        component={AboutUs}
        options={({route}) => ({
          title: route.params?.title,
        })}
      />
    </Stack.Navigator>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'HOME') {
            iconName = focused
              ? require('../Images/Icons/home-colour-icon1.png')
              : require('../Images/Icons/home-colour-icon.png');
          } else if (route.name === 'SERVICES') {
            iconName = focused
              ? require('../Images/Icons/service-plan-colour-icon1.png')
              : require('../Images/Icons/service-plan-icon1.png');
          }
          if (route.name === 'EXPLORE') {
            iconName = focused
              ? require('../Images/Icons/explore-colour-icon1.png')
              : require('../Images/Icons/explore-icon1.png');
          } else if (route.name === 'NOTIFICATION') {
            iconName = focused
              ? require('../Images/Icons/notification-colour-icon1.png')
              : require('../Images/Icons/notification-icon1.png');
          }
          if (route.name === 'PROFILE') {
            iconName = focused
              ? require('../Images/Icons/profile-colour-icon1.png')
              : require('../Images/Icons/profile-icon1.png');
          }

          // You can return any component that you like here!
          return (
            <Image
              source={iconName}
              style={{width: 25, height: 25}}
              resizeMode="contain"
            />
          );
        },
        activeTintColor: 'green',
        inactiveTintColor: 'black',
      })}
      options={{headerShown: false}}>
      <Tab.Screen
        name="HOME"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="SERVICES"
        component={Services}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="EXPLORE"
        component={Explore}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="NOTIFICATION"
        component={Notification}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="PROFILE"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomImage: {
    height: 25,
    width: 25,
  },
});

export default HomeStack;
