import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                const response = await axios.get('https://f86a-170-238-1-36.ngrok-free.app/veterinaria', { headers });
                console.log('Response from API:', response.data);

                setVetData(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de la veterinaria.');
            }
        };

        fetchVetData();
    }, []);

    const handleRate = () => {
        Alert.alert('Calificar', 'Funcionalidad para calificar con estrellas aún no implementada.');
    };

    const handleMessage = () => {
        Alert.alert('Enviar Mensaje', 'Funcionalidad para enviar mensaje aún no implementada.');
    };

    const handleNavigate = () => {
        navigation.navigate('FirstScreen'); 
    };

    const handleVetDetail = (vet) => {
        navigation.navigate('VeterinaryDetailScreen', { vet });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {vetData.map((vet, index) => (
                <View key={index} style={styles.vetContainer}>
                    <TouchableOpacity onPress={() => handleVetDetail(vet)}>
                        <Text style={styles.name}>{vet.veterinaryName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleVetDetail(vet)}>
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
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontStyle: 'italic', // Aplica el estilo cursiva
        color: '#573321', // Aplica un color específico
        textAlign: 'center', // Centra el texto
    },
    vetImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    descriptionInput: {
        width: '100%',
        paddingHorizontal: 10,
        color: 'black', // Asegura que el texto sea de color negro
        borderWidth: 0, // Quita el borde
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'gray',
        marginVertical: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    smallButton: {
        backgroundColor: '#573321',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VeterinarysScreen;
