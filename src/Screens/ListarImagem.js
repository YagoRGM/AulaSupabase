import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { supabase } from "../Config/supabaseConfig";

const BUCKET_NAME = "fotos-user";

export default function ListarImagens({navigation}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .storage
          .from(BUCKET_NAME)
          .list("", { limit: 100 });

        if (error) throw error;

        const imageFiles = data.filter(file =>
          file.name.match(/\.(jpg|jpeg|png)$/i)
        );

        const imageURLs = imageFiles.map(file => ({
          name: file.name,
          url: supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(file.name).data.publicUrl,
        }));

        setImages(imageURLs);
      } catch (error) {
        console.error("Erro ao listar imagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imagens</Text>

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('Upload Imagem')}
      >
        <Text style={styles.textoBotaoAdicionar}>+ Adicionar nova foto</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <ScrollView contentContainerStyle={styles.imageList}>
          {images.map((img) => (
            <View key={img.url} style={styles.imageContainer}>
              <Image
                source={{ uri: img.url }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.imageName}>{img.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#17408B",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  imageList: {
    paddingBottom: 100,
  },
  imageContainer: {
    marginBottom: 24,
    borderRadius: 18,
    backgroundColor: 'rgba(20,30,60,0.85)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  imageName: {
    fontSize: 14,
    marginBottom: 3,
    marginTop: 8,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#eee",
  }
});