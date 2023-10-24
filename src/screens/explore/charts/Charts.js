import React, {useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import IndexChart from './IndexChart';
import StockChart from './StockChart';

export default function Charts({navigation}) {
  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Tab.Navigator>
        <Tab.Screen name="Index Charts" component={IndexChart} />
        <Tab.Screen name="Stock Charts" component={StockChart} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
