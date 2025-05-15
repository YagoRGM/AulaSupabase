import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../Config/supabaseConfig';

const BUCKET_NAME = "fotos-user";

export default function UploadImagem({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Selecionar imagem da galeria
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Fazer upload para o Supabase
  const uploadImage = async () => {
  if (!image) {
    Alert.alert('Selecione uma imagem primeiro!');
    return;
  }

  setUploading(true);

  const img = await fetch(image.uri);
  const blob = await img.blob();
  // Pega extensão pelo tipo ou pelo nome
  const fileExt = image.uri.split('.').pop().split('?')[0].split(':')[0];
  const fileName = `${Date.now()}.${fileExt}`;

  let { error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(fileName, blob, {
      contentType: image.mimeType || `image/${fileExt}`,
      upsert: false,
    });

  setUploading(false);

  if (error) {
    Alert.alert('Erro ao fazer upload', error.message);
  } else {
    Alert.alert('Sucesso!', 'Imagem enviada com sucesso!');
    setImage(null);
    if (navigation) navigation.goBack();
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload de Imagem</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        ) : (
          <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !image && { backgroundColor: '#aaa' }]}
        onPress={uploadImage}
        disabled={!image || uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar Imagem</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17408B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F5F7FA',
    marginBottom: 30,
    textAlign: 'center',
  },
  imagePicker: {
    width: 260,
    height: 260,
    borderRadius: 18,
    backgroundColor: 'rgba(20,30,60,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#00B4D8',
    overflow: 'hidden',
  },
  imagePickerText: {
    color: '#A9BCD0',
    fontSize: 18,
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#0077FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00E0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#F5F7FA',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});