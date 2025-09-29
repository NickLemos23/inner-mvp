// mobile/src/navigation/RootStack.js
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../lib/supabase";

import LoginScreen from "../screens/LoginScreen";
import FeedScreen from "../screens/FeedScreen"; // usado na MainTabs
import GoScreen from "../screens/GoScreen";
import MeusIngressosScreen from "../screens/MeusIngressosScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import SplashScreen from "../screens/SplashScreen";

import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // pega sessão ao iniciar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    // ouve mudanças de auth (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
