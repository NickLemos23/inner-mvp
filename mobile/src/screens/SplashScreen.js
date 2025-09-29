import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * SplashScreen - tela inicial (vazia por enquanto)
 * Nesta versão inicial ela só redireciona visualmente para Login/Main.
 * Você pode adicionar lógica de carregamento/autenticação aqui depois.
 */
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Exemplo: após 1.2s ir para Login. Ajuste conforme necessário.
    const t = setTimeout(() => {
      navigation.replace("Login");
    }, 1200);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INNΞR</Text>
      <Text style={styles.subtitle}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 36, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#666" },
});
