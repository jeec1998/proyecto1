import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import Assets from './Assets';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const ProfileScreen = () => {
    const [userData, setUserData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = ''; // Aquí deberías obtener el accessToken almacenado previamente
                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get(`${API_URL}/user`, { headers });
                console.log('Response from API:', response.data); // Verifica la estructura de la respuesta en la consola
                setUserData(response.data); // Actualiza el estado con los datos recibidos
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        const { name, lastName, phone, password } = userData;
        const updatedUserData = {
            name,
            lastName,
            phone,
            password
        };

        try {
            const accessToken = ''; // Aquí también deberías obtener el accessToken almacenado previamente
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await axios.put(`${API_URL}/user`, updatedUserData, { headers });
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
                    value={userData.name}
                    onChangeText={(value) => setUserData({ ...userData, name: value })}
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
                    value={userData.phone}
                    onChangeText={(value) => setUserData({ ...userData, phone: value })}
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
