import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Login from '../Screens/Login';
import Cadastro from '../Screens/Cadastro';
import Inicio from '../Screens/Inicio';
import ListarImagem from '../Screens/ListarImagem';
import UploadImagem from '../Screens/UploadImagem';
import ListarVideo from '../Screens/ListarVideo';
import UploadVideo from '../Screens/UploadVideo';

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Início" component={Tabs} />
            <Stack.Screen name="Listar Imagem" component={ListarImagem} />
            <Stack.Screen name="Upload Imagem" component={UploadImagem} />
            <Stack.Screen name="Listar Video" component={ListarVideo} />
            <Stack.Screen name="Upload Video" component={UploadVideo} />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            initialRouteName="Início"
            screenOptions={({ route }) => ({
                headerStyle: {
                    backgroundColor: '#0B1D3A',
                },
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#0B1D3A',
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Listar Imagem':
                            iconName = focused ? 'image' : 'image-outline';
                            break;
                        case 'Início':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Listar Video':
                            // iconName = focused ? 'list' : 'list-outline';
                            iconName = focused ? 'videocam' : 'videocam-outline';
                            break;
                        default:
                            iconName = 'alert-circle';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
                tabBarStyle: {
                    backgroundColor: '#0B1D3A',
                    borderTopWidth: 0,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                },
            })}
        >
            <Tab.Screen name="Listar Imagem" component={ListarImagem} />
            <Tab.Screen name="Início" component={Inicio} />
            <Tab.Screen name="Listar Video" component={ListarVideo} />
        </Tab.Navigator>
    );
}
