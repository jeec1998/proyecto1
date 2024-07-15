import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';

const VeterinarysScreen = () => {
    const [vetData, setVetData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchVetData = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    Alert.alert('Error', 'No se encontró el access token.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get('https://0a83-2801-16-4800-5220-5915-790b-3bc4-f8f3.ngrok-free.app/veterinaria', { headers });
                console.log('Response from API:', response.data);

                setVetData(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de la veterinaria.');
            }
        };

        fetchVetData();
    }, []);

    const handleVetDetail = (vetId) => {
        navigation.navigate('VeterinaryDetailScreen', { vetId });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={Assets.logoImage} style={styles.logo} />
            </View>
            {vetData.map((vet, index) => (
                <View key={index} style={styles.vetContainer}>
                    <TouchableOpacity onPress={() => handleVetDetail(vet._id)}>
                        <Text style={styles.name}>{vet.veterinaryName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleVetDetail(vet._id)}>
                        {vet.imagVet && (
                            <Image 
                                source={{ uri: vet.imagVet }} 
                                style={styles.vetImage} 
                            />
                        )}
                    </TouchableOpacity>
                    {index < vetData.length - 1 && <View style={styles.separator} />}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F1D47B',
        padding: 20,
        alignItems: 'center',
    },
    vetContainer: {
        marginBottom: 20,
        width: '100%',
        marginTop: -240,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: -150,
    },
    logo: {
        width: 500, // Agrandar el logo
        height: 500,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontStyle: 'italic',
        color: '#573321',
        textAlign: 'center',
    },
    vetImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'gray',
        marginVertical: 20,
    },
});

export default VeterinarysScreen;
