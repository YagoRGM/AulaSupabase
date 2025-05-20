import React, { useEffect, useState } from 'react';
import { ScrollView, View, Dimensions, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../Config/supabaseConfig';
import { Video } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const bucketName = 'videos-user';

export default function ListarVideos({ navigation }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const [video, setVideo] = useState(null);
    const [category, setCategory] = useState();
    const [uploading, setUploading] = useState(false);
    const [VideoUri, setVideoUri] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .list("", { limit: 100 });

                if (error) {
                    console.log('Erro ao buscar vídeos', error);
                    throw error;
                }

                // Filtra vídeos com extensão .mp4 ou .webm (case insensitive)
                const videoFiles = data.filter((file) =>
                    file.name.match(/\.(mp4|webm)$/i)
                );

                // Mapeia para nome + url pública
                const videoUrls = videoFiles.map(file => ({
                    name: file.name,
                    url: supabase
                        .storage
                        .from(bucketName)
                        .getPublicUrl(file.name).data.publicUrl,
                }));

                setVideos(videoUrls);
            } catch (error) {
                console.error("Erro ao carregar vídeos: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "video/*",
                copyToCacheDirectory: true,
                multiple: false,  // só um vídeo
            });

            console.log('Resultado do DocumentPicker:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) {
                    alert('Vídeo selecionado inválido, tente novamente');
                    return;
                }

                const selectedVideo = {
                    uri: asset.uri,
                    name: asset.name || 'video.mp4',
                    type: asset.mimeType || 'video/mp4',
                };
                setVideo(selectedVideo);
                setVideoUri(asset.uri);
            } else if (result.canceled) {
                alert('Seleção cancelada');
            } else {
                alert('Seleção inválida');
            }
        } catch (error) {
            alert('Erro ao selecionar vídeo');
            console.log(error);
        }
    };




    const uploadVideo = async () => {
        try {
            setUploading(true);

            const filePath = `${video.name}`;
            const uploadUrl = `https://rdwcrvajzknnsoevigwp.supabase.co/storage/v1/object/videos-user/${filePath}`;

            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const token = sessionData.session?.access_token;
            if (!token) throw new Error('Token de acesso não encontrado');

            const result = await FileSystem.uploadAsync(uploadUrl, video.uri, {
                httpMethod: 'PUT',
                headers: {
                    'Content-Type': video.type || 'video/mp4',
                    Authorization: `Bearer ${token}`,
                },
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            });

            if (result.status !== 200) {
                alert('Erro, Falha ao enviar o vídeo');
            } else {
                setVideo(null);
                navigation.goBack();
            }
        } catch (error) {
            alert(`Erro inesperado: ${error.message}`);
            console.log(error);
        } finally {
            setUploading(false);
        }
    };

    const verificar = async () => {
        if (VideoUri) {
            await uploadVideo();
        } else {
            alert('Nenhum vídeo selecionado');
        }
    };


    const { width } = Dimensions.get('window');
    const videoWidth = width * 0.9;
    const videoHeight = (videoWidth * 9) / 16;

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Vídeos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0077FF" />
            ) : (
                <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingVertical: 10 }}>
                    {videos.map((video) => (
                        <View key={video.name} style={styles.videoContainer}>
                            <Text style={styles.videoTitle}>{video.name}</Text>
                            <Video
                                source={{ uri: video.url }}
                                style={{ width: videoWidth, height: videoHeight }}
                                useNativeControls
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </ScrollView>
            )}

            <TouchableOpacity style={styles.botaoAdicionar} onPress={pickVideo}>
                <Text style={styles.textoBotaoAdicionar}>Adicionar novo vídeo</Text>
            </TouchableOpacity>

            {VideoUri && (
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', marginBottom: 8 }}>Vídeo selecionado:</Text>
                    <Video
                        source={{ uri: VideoUri }}
                        style={{ width: videoWidth, height: videoHeight }}
                        resizeMode="contain"
                        useNativeControls
                    />
                </View>
            )}

            <TouchableOpacity onPress={verificar} style={styles.botao_enviar_video} disabled={uploading}>
                <Text style={styles.botaoText_enviarVideo}>
                    {uploading ? 'Enviando...' : 'Enviar vídeo'}
                </Text>
            </TouchableOpacity>
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
    scrollView: {
        width: '100%',
        marginBottom: 10,
    },
    videoContainer: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    videoTitle: {
        color: '#FFF',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    botaoAdicionar: {
        backgroundColor: '#0077FF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#00E0FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 10,
    },
    textoBotaoAdicionar: {
        color: '#F5F7FA',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    botao_enviar_video: {
        marginTop: 20,
        backgroundColor: 'rgba(0, 119, 255, 0.53)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#00E0FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    botaoText_enviarVideo: {
        color: '#F5F7FA',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});