import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

/**
 * LoginScreen - tela de login (placeholder)
 * - Ao clicar no botão "Entrar (simulado)" navegamos para MainTabs.
 * - Substitua por formulário e integração com Supabase depois.
 */
export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.hint}>Tela de login (simulada)</Text>

      <View style={{ marginTop: 20, width: "60%" }}>
        <Button title="Entrar (simulado)" onPress={() => navigation.replace("MainTabs")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  hint: { marginTop: 8, color: "#666" },
});
