import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../Config/supabaseConfig';

export default function UploadVideo() {
    const [videos, setVideo] = useState([]);
    const [carregando, setCarregando] = useState(true);

    return (
        <View >
            <Text>Upload de Videos</Text>
        
        </View>
    );
}