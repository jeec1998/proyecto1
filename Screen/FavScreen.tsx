import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavScreen = () => {
    const [favoriteVets, setFavoriteVets] = useState([]);
    const navigation = useNavigation();
    const [vetData, setVetData] = useState({
        name: '',
        image: '',
        description: ''
    });
    useEffect(() => {
        const fetchFavoriteVets = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    Alert.alert('Error', 'No se encontró el access token.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get(`https://f86a-170-238-1-36.ngrok-free.app/vet`, { headers });
                console.log('Response from API:', response.data);

                setFavoriteVets(response.data.favoriteVets); // Suponiendo que response.data tiene una propiedad favoriteVets que es un array de veterinarias favoritas
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de las veterinarias favoritas.');
            }
        };

        fetchFavoriteVets();
    }, []);

    const handleUpdate = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                Alert.alert('Error', 'No se encontró el access token.');
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await axios.put(`https://f86a-170-238-1-36.ngrok-free.app/vet`, { favoriteVets }, { headers });
            Alert.alert('Actualización exitosa', 'La información de las veterinarias favoritas ha sido actualizada.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error de actualización', 'Hubo un problema al actualizar la información de las veterinarias favoritas.');
        }
    };

    const handleRate = () => {
        Alert.alert('Calificar', 'Funcionalidad para calificar con estrellas aún no implementada.');
    };

    const handleMessage = () => {
        Alert.alert('Enviar Mensaje', 'Funcionalidad para enviar mensaje aún no implementada.');
    };

    const handleNavigate = () => {
        navigation.navigate('FirstScreen'); 
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={{ uri: vetData.image }} style={styles.logo} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la Veterinaria"
                value={vetData.name}
                onChangeText={(value) => setVetData({ ...vetData, name: value })}
            />
            <TextInput
                style={styles.input}
                placeholder="URL de la Imagen"
                value={vetData.image}
                onChangeText={(value) => setVetData({ ...vetData, image: value })}
            />
            <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={vetData.description}
                onChangeText={(value) => setVetData({ ...vetData, description: value })}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.smallButton} onPress={handleRate}>
                    <Text style={styles.buttonText}>Calificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={handleMessage}>
                    <Text style={styles.buttonText}>Chatear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={handleNavigate}>
                    <Text style={styles.buttonText}>IR</Text>
                </TouchableOpacity>
            </View>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#573321',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    vetContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    vetName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    vetDescription: {
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default FavScreen;
