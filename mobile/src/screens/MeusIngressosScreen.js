// mobile/src/screens/MeusIngressosScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import QRCode from "react-qr-code"; // precisamos instalar essa lib

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
  } catch {
    return iso;
  }
}

export default function MeusIngressosScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data, error } = await supabase
        .from("tickets")
        .select(`
          id,
          created_at,
          events (
            id, title, event_date, venue, producers ( name )
          )
        `)
        .eq("owner_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const renderItem = ({ item }) => {
    const event = item.events;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("TicketDetails", { ticketId: item.id })}
      >
        <Text style={styles.title}>{event?.title}</Text>
        <Text style={styles.meta}>🎤 {event?.producers?.name}</Text>
        <Text style={styles.meta}>📍 {event?.venue}</Text>
        <Text style={styles.meta}>🗓 {formatDate(event?.event_date)}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Carregando ingressos...</Text>
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Você ainda não possui ingressos.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tickets}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  meta: { color: "#555" },
});
