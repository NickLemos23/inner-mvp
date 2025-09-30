// mobile/src/screens/GoScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { supabase } from "../lib/supabase";

// helpers
function formatDate(iso) {
  try {
    const d = new Date(iso);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  } catch {
    return iso;
  }
}

function centsToBRL(cents) {
  if (typeof cents !== "number") return "R$ 0,00";
  return "R$ " + (cents / 100).toFixed(2).replace(".", ",");
}

export default function GoScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          description,
          venue,
          city,
          category,
          event_date,
          price_cents,
          image_url,
          producers ( name )
        `)
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const producerName = item?.producers?.name ?? "Produtor";
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.banner} />
        ) : (
          <View style={[styles.banner, styles.bannerPlaceholder]}>
            <Text style={{ color: "#777" }}>Sem imagem</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{producerName}</Text>
          <Text style={styles.meta}>📍 {item.venue}{item.city ? `, ${item.city}` : ""}</Text>
          <Text style={styles.meta}>🗓 {formatDate(item.event_date)}</Text>
          <Text style={styles.price}>{centsToBRL(item.price_cents)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={events.length === 0 ? styles.centerList : { padding: 12 }}
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={<Text>Nenhum evento disponível.</Text>}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  centerList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  banner: {
    width: "100%",
    height: 160,
    backgroundColor: "#f2f2f2",
  },
  bannerPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  meta: {
    color: "#555",
  },
  price: {
    marginTop: 6,
    fontWeight: "700",
    fontSize: 16,
  },
});
