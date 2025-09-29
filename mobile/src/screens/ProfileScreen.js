import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * ProfileScreen - perfil do usuário (vazio por enquanto)
 */
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.hint}>Dados do usuário e configurações.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  hint: { marginTop: 8, color: "#666" },
});
