import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar posts + produtores
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          content,
          created_at,
          producers (
            name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Função para formatar a data
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Renderizar cada post
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.producer}>
        {item.producers?.name || "Produtor desconhecido"}
      </Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.date}>{formatDate(item.created_at)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Nenhum post disponível</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  producer: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  content: { fontSize: 14, color: "#333", marginBottom: 6 },
  date: { fontSize: 12, color: "#888", textAlign: "right" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { fontSize: 16, color: "#666" },
});
