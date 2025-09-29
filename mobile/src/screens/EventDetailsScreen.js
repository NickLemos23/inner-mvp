import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * EventDetailsScreen - detalhes de evento (vazio por enquanto)
 * Esta tela será usada em stack (pode ser empilhada sobre as tabs).
 */
export default function EventDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Details</Text>
      <Text style={styles.hint}>Informações do evento e compra simulada.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  hint: { marginTop: 8, color: "#666" },
});
