import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import Assets from './Assets';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    Alert.alert('Error', 'No se encontró el access token.');
                    return;
                }
    
                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get(`https://53eb-157-100-143-78.ngrok-free.app/user/${accessToken}`, { headers });
                console.log('Response from API:', response.data);
                
                const { firstName, lastName, email, phoneNumber, password } = response.data; // Ajusta esto según la estructura de la respuesta de tu API
                setUserData({ firstName, lastName, email, phoneNumber, password });
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información del usuario.');
            }
        };
    
        fetchUserData();
    }, []);
    

    const handleUpdate = async () => {
        const { firstName, lastName, phoneNumber, password } = userData;
        const updatedUserData = {
            firstName,
            lastName,
            phoneNumber,
            password
        };

        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                Alert.alert('Error', 'No se encontró el access token.');
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await axios.put(`https://53eb-157-100-143-78.ngrok-free.app/user`, updatedUserData, { headers });
            Alert.alert('Actualización exitosa', 'La información del usuario ha sido actualizada.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error de actualización', 'Hubo un problema al actualizar la información del usuario.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={Assets.logoImage} style={styles.logo} />
            </View>
            <Text style={styles.header}>Información del Cliente</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={userData.firstName}
                    onChangeText={(value) => setUserData({ ...userData, firstName: value })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={userData.lastName}
                    onChangeText={(value) => setUserData({ ...userData, lastName: value })}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: '#e0e0e0' }]}
                    placeholder="Correo Electrónico"
                    value={userData.email}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número de Teléfono"
                    value={userData.phoneNumber}
                    onChangeText={(value) => setUserData({ ...userData, phoneNumber: value })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={userData.password}
                    onChangeText={(value) => setUserData({ ...userData, password: value })}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Actualizar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    logoContainer: {
        marginTop: -150,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
        marginTop: -100,
    },
    input: {
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
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
