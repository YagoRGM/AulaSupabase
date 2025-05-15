import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../Config/supabaseConfig';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });

        setLoading(false);

        if (error) {
            Alert.alert('Erro ao logar', error.message);
            // alert('Erro ao logar', error.message);
        } else {
            navigation.replace('Início');
            alert('Login concluido com sucesso');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.titulo}>Bem-vindo ao APP SUPABASE</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoTexto}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1D3A',
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: '100%',
        maxWidth: 370,
        backgroundColor: '#1C3A63',
        // 13294B
        borderRadius: 22,
        padding: 32,
        shadowColor: '#3A7CA5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1.5,
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F5F7FA',
        marginBottom: 40,
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: '#001F54',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    input: {
        backgroundColor: '#183B66',
        color: '#F5F7FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#2F5E94',
        fontSize: 16,
        shadowColor: '#2F5E94',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    botao: {
        backgroundColor: '#2471C8',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#2F5E94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 15,
    },
    botaoTexto: {
        color: '#F5F7FA',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    link: {
        color: '#A9BCD0',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});
