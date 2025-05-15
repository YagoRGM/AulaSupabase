import React, { useEffect, useState } from 'react';
import { ScrollView, View, Dimensions, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../Config/supabaseConfig';
import { Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';

const bucketName = 'videos-user'

export default function ListarVideos({ navigation }) {

    // LISTAR VIDEO
    const [categorys, setCategorys] = useState('');
    const [categories, setCategories] = useState([])
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingCategories, setLoadingCategories] = useState(true)

    // UPLOAD DE VIDEO
    const [video, setvideo] = useState(null)
    const [category, setCategory] = useState('matematica')
    const [uploading, setUploading] = useState(false)
    const [VideoUri, setVideoUri] = useState(null);

    // LISTAR VIDEOS
    const fetchCategories = async () => {
        setLoadingCategories(true)
        try {
            const { data, error } = await supabase.storage
                .from(bucketName)
                .list("", {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: "name", order: "asc" },
                })
            if (error) {
                console.error('Erro ao buscar categorias', error)
                throw error
            }
            console.log('Dados das categorias:', data)

            const categoriesList = data.map((file) => file.name)
            setCategories(categoriesList)
            console.log('Categorias extraidas', categoriesList)

            if (categoriesList.length > 0) {
                setCategorys(categoriesList[0])
            }
        }
        catch (error) {
            console.log('Erro ao carregar categorias', error)
        }
        finally {
            setLoadingCategories(false)
        }
    }



    // LISTAR VIDEOS
    const fetchVideos = async () => {
        if (!categorys) return

        setLoading(true);
        const prefix = `${categorys}/`

        try {
            const { data, error } = await supabase.storage
                .from(bucketName)
                .list(prefix, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                })

            if (error) {
                console.log('Erro ao buscar videos', error)
                throw error
            }

            console.log('Dados dos videos', data)

            const videoFiles = data?.filter((file) =>
                file.name.endsWith('.mp4')
            )

            if (videoFiles?.length > 0) {
                const videoUrls = videoFiles.map((file) => {
                    const fullPath = `${prefix}${file.name}`;
                    const { data } = supabase.storage.from(bucketName).getPublicUrl(fullPath);
                    const publicUrl = data?.publicUrl || "";
                    console.log("URL pública gerada:", publicUrl);
                    return {
                        key: file.name,
                        name: file.name,
                        url: publicUrl,
                    };
                });

                setVideos(videoUrls);
            } else {
                setVideos([]); // Caso não haja vídeos
            }
        } catch (error) {
            console.error("Erro ao carregar vídeos: ", error);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categorys) {
            fetchVideos();
        }
    }, [categorys]);



    // UPLOAD DE VIDEOS
    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "video/*",
                copyToCacheDirectory: true
            });

            if (result?.type === 'success') {
                const selectedVideo = {
                    uri: result.uri,
                    name: result.name || 'video.mp4',
                    type: result.mimeType || 'video/mp4',
                };
                setvideo(selectedVideo);
                setVideoUri(result.uri);
            } else {
                console.log('Seleção cancelada ou inválida');
                alert('Seleção cancelada ou inválida');
            }
        } catch (error) {
            console.log('Erro ao selecionar vídeo:', error);
            alert('Erro ao selecionar vídeo');
        }
    };




    // UPLOAD DE VIDEOS
    const uploadVideo = async () => {
        if (!video || !category) {
            alert('Erro, selecione uma categoria')
            return
        }
        try {
            setUploading(true);

            const timestamp = new Date().getTime();
            const filePath = `${category}/${timestamp}_${video.name}`
            const uploadUrl = `https://rdwcrvajzknnsoevigwp.supabase.co/storage/v1/object/videos-user/${filePath}`

            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const token = sessionData.session?.access_token
            if (!token) throw new Error('Token de acesso não encontrado')

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
            console.log('Erro no uploadVideo:', error);
            alert(`Erro inesperado: ${error.message}`);
        } finally {
            setUploading(false)
        }
    }



    const verificar = async () => {
        if (VideoUri) {
            await uploadVideo();
        }
        else {
            alert('Nenhum video selecionado')
        }
    }


    const { width } = Dimensions.get('window');
    const videoWidth = width * 0.9;
    const videoHeight = (videoWidth * 9) / 16;

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Videos</Text>

            <TouchableOpacity style={styles.botaoAdicionar} onPress={pickVideo}>
                <Text style={styles.textoBotaoAdicionar}>Adicionar novo vídeo</Text>
            </TouchableOpacity>

            {VideoUri && (
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', marginBottom: 8 }}>Vídeo selecionado:</Text>
                    <Video
                        source={{ uri: VideoUri }}
                        style={{
                            width: videoWidth,
                            height: videoHeight,
                            borderRadius: 8,
                            backgroundColor: '#000'
                        }}
                        resizeMode="contain"
                        useNativeControls
                    />
                </View>
            )}

            <TouchableOpacity onPress={verificar} style={styles.botao_enviar_video}>
                <Text style={styles.botaoText_enviarVideo}>Enviar vídeo</Text>
            </TouchableOpacity>

            <Text style={styles.titulo}>Selecione um Video</Text>
            {loadingCategories ? (
                <ActivityIndicator size="large" color="#0077FF" />
            ) : (
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => {
                        setCategory(itemValue);
                        setCategorys(itemValue); // <-- isso sincroniza as duas variáveis
                    }}
                    style={styles.picker}
                >
                    {categories.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                </Picker>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#0077FF" />
            ) : (
                <ScrollView style={styles.scrollView}>
                    {videos.map((video) => (
                        <View key={video.key} style={styles.videoContainer}>
                            <Text style={styles.videoTitle}>{video.name}</Text>
                            <Video
                                source={{ uri: video.url }}
                                style={styles.video}
                                useNativeControls
                                resizeMode="contain"
                                isLooping
                            />
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

    botao_enviar_video: {
        margin: 30,
        backgroundColor: 'rgba(0, 119, 255, 0.53)',
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
    botaoText_enviarVideo: {
        color: '#F5F7FA',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});