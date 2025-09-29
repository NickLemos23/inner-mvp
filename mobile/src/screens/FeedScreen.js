import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * FeedScreen - feed principal (vazio por enquanto)
 */
export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text style={styles.hint}>Aqui ficará a listagem de posts.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  hint: { marginTop: 8, color: "#666" },
});
