import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../Config/supabaseConfig';

export default function ListarVideo({navigation}) {
    const [videos, setVideo] = useState([]);
    const [carregando, setCarregando] = useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Videos</Text>
            <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => navigation.navigate('Upload Video')}
            >
                <Text style={styles.textoBotaoAdicionar}>+ Adicionar novo video</Text>
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