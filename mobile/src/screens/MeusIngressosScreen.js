import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * MeusIngressosScreen - meus ingressos com QR code (placeholder)
 */
export default function MeusIngressosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Ingressos</Text>
      <Text style={styles.hint}>Lista de ingressos (QR Code) aparecerá aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  hint: { marginTop: 8, color: "#666" },
});
