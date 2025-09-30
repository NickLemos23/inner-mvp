// mobile/src/screens/EventDetailsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";

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

export default function EventDetailsScreen({ route }) {
  const { eventId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select(`
            id, title, description, venue, city, category,
            event_date, price_cents, image_url,
            producers ( name )
          `)
          .eq("id", eventId)
          .maybeSingle();
        if (error) throw error;
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) load();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Evento não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {event.image_url ? (
        <Image source={{ uri: event.image_url }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, styles.bannerPlaceholder]}>
          <Text style={{ color: "#777" }}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.producer}>{event.producers?.name ?? "Produtor"}</Text>

      <Text style={styles.meta}>📍 {event.venue}{event.city ? `, ${event.city}` : ""}</Text>
      <Text style={styles.meta}>🗓 {formatDate(event.event_date)}</Text>
      <Text style={styles.price}>{centsToBRL(event.price_cents)}</Text>

      {event.description ? (
        <>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.desc}>{event.description}</Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  container: { padding: 16, backgroundColor: "#fff" },
  banner: { width: "100%", height: 220, backgroundColor: "#f2f2f2", borderRadius: 12 },
  bannerPlaceholder: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginTop: 12 },
  producer: { color: "#666", marginBottom: 8 },
  meta: { marginTop: 4, color: "#444" },
  price: { marginTop: 8, fontSize: 18, fontWeight: "700" },
  sectionTitle: { marginTop: 16, fontSize: 16, fontWeight: "600" },
  desc: { marginTop: 6, color: "#333", lineHeight: 20 },
});
