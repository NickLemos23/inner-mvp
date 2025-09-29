import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Função de login
  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Erro", "Email ou senha incorretos.");
        return;
      }

      if (data.session) {
        // Salvar sessão manualmente (opcional, já é feito pelo supabase-js)
        await AsyncStorage.setItem("supabase_session", JSON.stringify(data.session));

        // Navegar para FeedScreen (que está dentro das Tabs)
        navigation.replace("MainTabs", { screen: "Feed" });
      }
    } catch (err) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função de cadastro
  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Erro", error.message);
        return;
      }

      Alert.alert("Sucesso", "Cadastro realizado! Verifique seu email para confirmar.");
    } catch (err) {
      Alert.alert("Erro inesperado", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INNΞR</Text>
      <Text style={styles.subtitle}>Acesse sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title={loading ? "Carregando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={handleSignUp} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24 },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 6,
  },
});
