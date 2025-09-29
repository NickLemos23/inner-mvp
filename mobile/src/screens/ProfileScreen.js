// mobile/src/screens/ProfileScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      // 1) pega user atual do Supabase Auth
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      const { user } = userData;
      setUserId(user.id);
      setEmail(user.email ?? "");

      // 2) busca linha na tabela "users" (se não tiver, cria)
      const { data: rows, error: selectErr } = await supabase
        .from("users")
        .select("id, email, name, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (selectErr) throw selectErr;

      if (!rows) {
        // cria linha inicial
        const defaultName = user.email ? user.email.split("@")[0] : "Usuário";
        const { error: upsertErr } = await supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email,
            name: defaultName,
            bio: "",
          },
          { onConflict: "id" }
        );
        if (upsertErr) throw upsertErr;

        setName(defaultName);
        setBio("");
      } else {
        setName(rows.name ?? "");
        setBio(rows.bio ?? "");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar seu perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onSave = async () => {
    if (!userId) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from("users")
        .update({ name: name.trim(), bio: bio.trim() })
        .eq("id", userId);

      if (error) throw error;
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar seu perfil.");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    try {
      await supabase.auth.signOut();
      // RootStack está ouvindo a sessão; ao sair, ele redireciona para Login
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <Text style={styles.label}>Email (não editável)</Text>
      <TextInput style={[styles.input, styles.inputDisabled]} value={email ?? ""} editable={false} />

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Fale sobre você"
        multiline
      />

      <View style={{ height: 12 }} />

      <Button title={saving ? "Salvando..." : "Salvar"} onPress={onSave} disabled={saving} />

      <View style={{ height: 24 }} />

      <Button title="Sair" color="#c62828" onPress={onLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#777",
  },
});
