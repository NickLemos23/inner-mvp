import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import MainTabs from "./MainTabs";
import EventDetailsScreen from "../screens/EventDetailsScreen";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* MainTabs contém o Bottom Tabs (Feed, Go, MeusIngressos, Profile) */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      {/* EventDetails pode ser acessado a partir do feed/Go via navigation.navigate('EventDetails') */}
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
}
