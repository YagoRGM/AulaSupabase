import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../Config/supabaseConfig';
import * as DocumentPicker from 'expo-document-picker'
import { Picker } from '@react-native-picker/picker'
import * as FileSystem from 'expo-file-system'

export default function UploadVideo({ navigation }) {
    const [video, setvideo] = useState(null)
    const [category, setCategory] = useState('matematica')
    const [uploading, setUploading] = useState(false)

    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "video/*",
                copyToCacheDirectory: true
            })

            const asset =
                result.assets && result.assets.length > 0
                    ? result.assets[0]
                    : result

            if (asset && asset.uri) {
                const selectedVideo = {
                    uri: asset.uri,
                    name: asset.name || 'video.mp4',
                    type: asset.mimeType || 'video/mp4'
                };
                setvideo(selectedVideo)
            } else {
                console.log('Erro, nenhum video selecionado')
                alert('Erro, nenhum video selecionado')
            }
        } catch (error) {
            console.log('Erro ao selecionar video', error)
            alert('Erro ao selecionar video', error)
        }
    }

    const uploadVideo = async () => {
        if (!video || !category) {
            alert('Erro, selecione uma categoria')
            return
        }
        try {
            setUploading(true);

            const timestamp = new Date().getTime();
            const filePath = `${category}/${timestamp}_${video.name}`
            const uploadUrl = ``

            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const token = sessionData.session?.access_token
            if (!token) throw new Error('Token de acessp nao encontrado')

            const result = await FileSystem.uploadAsync(uploadUrl, video.uri, {
                httpMethod: 'PUT',
                headers: {
                    'Content-Type': video.type || 'video/mp4',
                    Authorization: `Bearer ${token}`
                },
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            })

            if (result.status != 200) {
                alert('Erro, Falha ao enviar o video')
            }
            else {
                setvideo(null)
                navigation.goback()
            }
        } catch (error) {
            alert('Erro inesperado durante o upload')
        } finally {
            setUploading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Videos</Text>
            <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => pickVideo}
            >
                <Text style={styles.textoBotaoAdicionar}>Upload de video</Text>
            </TouchableOpacity>
            <FlatList
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C3A63',
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 24,
        color: '#F5F7FA',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    botaoAdicionar: {
        backgroundColor: '#0077FF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#00E0FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    textoBotaoAdicionar: {
        color: '#F5F7FA',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    card: {
        flex: 1,
        backgroundColor: '#1A2639',
        margin: 8,
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        padding: 10,
    },
    imagem: {
        width: 140,
        height: 140,
        borderRadius: 12,
    },
    nome: {
        marginTop: 8,
        color: '#A9BCD0',
        fontSize: 14,
    },
    loading: {
        color: '#F5F7FA',
        marginTop: 10,
    },
});