import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FeedScreen from "../screens/FeedScreen";
import GoScreen from "../screens/GoScreen";
import MeusIngressosScreen from "../screens/MeusIngressosScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Feed" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Go" component={GoScreen} />
      <Tab.Screen name="MeusIngressos" component={MeusIngressosScreen} options={{ title: "Meus Ingressos" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
