import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../Config/supabaseConfig';

export default function ListarImagem({ navigation }) { // Adicione navigation aqui
    const [imagens, setImagens] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const listarImagensPerfil = async () => {
        const { data, error } = await supabase
            .storage
            .from('fotos-user')
            .list('', { limit: 100 });

        if (error) {
            console.error('Erro ao listar imagens:', error);
            return;
        }

        const urls = data
            .filter((arquivo) => arquivo.name)
            .map((arquivo) => {
                const caminho = arquivo.id || arquivo.path || arquivo.name;
                const { publicURL } = supabase
                    .storage
                    .from('fotos-user')
                    .getPublicUrl(caminho);

                return {
                    nome: arquivo.name,
                    url: publicURL,
                };
            });

        console.log(urls);

        setImagens(urls);
        setCarregando(false);
    };

    useEffect(() => {
        listarImagensPerfil();
    }, []);

    if (carregando) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loading}>Carregando imagens...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Fotos</Text>
            <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => navigation.navigate('Upload Imagem')}
            >
                <Text style={styles.textoBotaoAdicionar}>+ Adicionar nova foto</Text>
            </TouchableOpacity>
            <FlatList
                data={imagens}
                keyExtractor={(item) => item.nome}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.url }} style={styles.imagem} />
                        <Text style={styles.nome}>{item.nome}</Text>
                    </View>
                )}
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