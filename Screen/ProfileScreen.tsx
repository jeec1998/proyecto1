import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import Assets from './Assets';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [userData, setUserData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
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
                const response = await axios.get('https://e9a1-45-184-102-78.ngrok-free.app/user/me', { headers });
                console.log('Response from API:', response.data);

                const { _id, firstName, lastName, email, phoneNumber } = response.data;
                setUserData({ userId: _id, firstName, lastName, email, phoneNumber });

                // Guardar el ID del usuario en AsyncStorage
                await AsyncStorage.setItem('userId', _id);
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'No se pudo obtener la información del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        const { firstName, lastName, phoneNumber } = userData;
        const updatedUserData = {
            firstName,
            lastName,
            phoneNumber
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
            await axios.patch('https://e9a1-45-184-102-78.ngrok-free.app/user/me', updatedUserData, { headers });
            Alert.alert('Actualización exitosa', 'La información del usuario ha sido actualizada.');
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Error de actualización', 'Hubo un problema al actualizar la información del usuario.');
        }
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePasswordScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={Assets.logoImage} style={styles.logo} />
            </View>
            <View style={styles.formContainer}>
            <Text style={styles.header}>Información Personal</Text>
                <TextInput
                    style={[styles.input, styles.textBlack]}
                    placeholder="Nombre"
                    value={userData.firstName}
                    onChangeText={(value) => setUserData({ ...userData, firstName: value })}
                />
                <TextInput
                    style={[styles.input, styles.textBlack]}
                    placeholder="Apellido"
                    value={userData.lastName}
                    onChangeText={(value) => setUserData({ ...userData, lastName: value })}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: '#e0e0e0' }, styles.textBlack]}
                    placeholder="Correo Electrónico"
                    value={userData.email}
                    editable={false}
                />
                <TextInput
                    style={[styles.input, styles.textBlack]}
                    placeholder="Número de Teléfono"
                    value={userData.phoneNumber}
                    onChangeText={(value) => setUserData({ ...userData, phoneNumber: value })}
                />
                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Cambiar Contraseña</Text>
                </TouchableOpacity>
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
        backgroundColor: '#F1D47B',
        padding: 20,
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 20,
        marginTop: -200,
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    textBlack: {
        color: 'black',
    },
    button: {
        backgroundColor: '#573321',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
