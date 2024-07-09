import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

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
                const response = await axios.get(`${API_URL}/veterinaria`, { headers });
                console.log('Response from API:', response.data);

                // Suponiendo que la respuesta es un array de veterinarias
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {vetData.map((vet, index) => (
                <View key={index} style={styles.vetContainer}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Nombre de la Veterinaria"
                        placeholderTextColor="gray"
                        value={vet.veterinaryName}
                        onChangeText={(value) => {
                            const newVetData = [...vetData];
                            newVetData[index].veterinaryName = value;
                            setVetData(newVetData);
                        }}
                        editable={false}
                    />
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Descripción"
                        placeholderTextColor="gray"
                        value={vet.description}
                        onChangeText={(value) => {
                            const newVetData = [...vetData];
                            newVetData[index].description = value;
                            setVetData(newVetData);
                        }}
                        multiline
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.smallButton} onPress={handleRate}>
                            <Text style={styles.buttonText}>Calificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallButton} onPress={handleMessage}>
                            <Text style={styles.buttonText}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallButton} onPress={handleNavigate}>
                            <Text style={styles.buttonText}>IR</Text>
                        </TouchableOpacity>
                    </View>
                    {index < vetData.length - 1 && <View style={styles.separator} />}
                </View>
            ))}
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
    vetContainer: {
        marginBottom: 20,
        width: '100%',
    },
    nameInput: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        color: 'black', // Asegura que el texto sea de color negro
        borderWidth: 0, // Quita el borde
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
