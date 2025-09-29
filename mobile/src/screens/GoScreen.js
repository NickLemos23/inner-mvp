import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * GoScreen - lista de eventos (vazia por enquanto)
 */
export default function GoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go</Text>
      <Text style={styles.hint}>Lista de eventos vai aparecer aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  hint: { marginTop: 8, color: "#666" },
});
