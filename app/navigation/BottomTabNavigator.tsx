import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import Colors from '../constants/Colors';
import TransactionsScreen from '../screens/TransactionsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { BottomTabParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -2 }} {...props} />;
}

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerStyle: { backgroundColor: Colors.light.background },
        headerTintColor: Colors.light.text,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={TransactionsScreen}
        options={{
          headerTitle: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerTitle: 'History',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="time-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings-outline" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
