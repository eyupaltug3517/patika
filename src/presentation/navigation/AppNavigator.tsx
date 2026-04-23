import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { HealthScreen } from '../screens/healthLog/HealthScreen';
import { AIAssistantScreen } from '../screens/aiAssistant/AIAssistantScreen';
import { AppointmentsScreen } from '../screens/appointments/AppointmentsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { PetProfileScreen } from '../screens/petProfile/PetProfileScreen';
import { AddAppointmentScreen } from '../screens/appointments/AddAppointmentScreen';
import { HealthLogEntryScreen } from '../screens/healthLog/HealthLogEntryScreen';

import { RootStackParamList, RootTabParamList } from './types';

const PRIMARY = '#7A9E6B';
const TEXT_SECONDARY = '#7A6855';
const SURFACE = '#F0EAE0';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#7A9E6B',
      tabBarInactiveTintColor: '#7A6855',
      tabBarStyle: {
        backgroundColor: '#F0EAE0',
        borderTopWidth: 0,
        elevation: 0,
        shadowColor: '#C8BAA8',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        height: 65,
        paddingBottom: 10,
        paddingTop: 6,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
    }}
  >
    <Tab.Screen
      name="Anasayfa"
      component={DashboardScreen}
      options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
    />
    <Tab.Screen
      name="Sağlık"
      component={HealthScreen}
      options={{ tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} /> }}
    />
    <Tab.Screen
      name="Asistan"
      component={AIAssistantScreen}
      options={{
        tabBarIcon: () => (
          <View style={styles.assistantIcon}>
            <Feather name="cpu" size={26} color={SURFACE} />
          </View>
        ),
        tabBarLabel: () => null,
      }}
    />
    <Tab.Screen
      name="Randevular"
      component={AppointmentsScreen}
      options={{ tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} /> }}
    />
    <Tab.Screen
      name="Ayarlar"
      component={SettingsScreen}
      options={{ tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} /> }}
    />
  </Tab.Navigator>
);

export const AppNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen
      name="PetProfile"
      component={PetProfileScreen}
      options={{ headerShown: true, title: 'Hayvan Profili', headerStyle: { backgroundColor: '#F0EAE0' }, headerTintColor: '#7A9E6B' }}
    />
    <Stack.Screen
      name="AddAppointment"
      component={AddAppointmentScreen}
      options={{ headerShown: true, title: 'Randevu Ekle', headerStyle: { backgroundColor: '#F0EAE0' }, headerTintColor: '#7A9E6B' }}
    />
    <Stack.Screen
      name="HealthLogEntry"
      component={HealthLogEntryScreen}
      options={{ headerShown: true, title: 'Sağlık Kaydı', headerStyle: { backgroundColor: '#F0EAE0' }, headerTintColor: '#7A9E6B' }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  assistantIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7A9E6B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4E7040',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
});
