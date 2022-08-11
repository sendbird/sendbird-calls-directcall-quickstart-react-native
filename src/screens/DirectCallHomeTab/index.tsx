import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import Header from '../../components/Header';
import SBIcon from '../../components/SBIcon';
import UserInfoHeader from '../../components/UserInfoHeader';
import { DirectRoutes } from '../../navigations/routes';
import Palette from '../../styles/palette';
import DirectCallDialScreen from './DirectCallDialScreen';
import DirectCallHistoryScreen from './DirectCallHistoryScreen';
import DirectCallSettingsStack from './DirectCallSettingsStack';

const Tab = createBottomTabNavigator();

const DirectCallHomeTab = () => {
  const tabColor = (focused: boolean) => (focused ? Palette.background600 : Palette.background300);
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarHideOnKeyboard: false }}>
      <Tab.Screen
        name={DirectRoutes.DIAL}
        component={DirectCallDialScreen}
        options={{
          header: UserInfoHeader,
          tabBarIcon: ({ focused }) => <SBIcon icon={focused ? 'CallFilled' : 'Call'} color={tabColor(focused)} />,
        }}
      />
      <Tab.Screen
        name={DirectRoutes.HISTORY}
        component={DirectCallHistoryScreen}
        options={{
          header: () => <Header title={'Recents'} titleAlignCenter />,
          tabBarIcon: ({ focused }) => <SBIcon icon={'CallHistory'} color={tabColor(focused)} />,
        }}
      />
      <Tab.Screen
        name={DirectRoutes.SETTINGS_STACK}
        component={DirectCallSettingsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <SBIcon icon={focused ? 'Settings' : 'Settings'} color={tabColor(focused)} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default DirectCallHomeTab;
