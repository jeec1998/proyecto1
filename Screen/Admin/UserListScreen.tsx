import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from '../Assets';
import { API_URL } from '@env';

const UserListScreen = () => {
    const [userData, setUserData] = useState([]);
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
                const response = await axios.get(`https://5394-45-184-102-76.ngrok-free.app/user`, { headers });
                setUserData(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de los usuarios.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async (user) => {
        const { _id, firstName, lastName, phoneNumber } = user;
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
    
            const url = `https://5394-45-184-102-76.ngrok-free.app/user/${_id}`;
            console.log('URL:', url);
            console.log('Updated Data:', updatedUserData);
    
            await axios.patch(url, updatedUserData, { headers });
            Alert.alert('Actualización exitosa', 'La información del usuario ha sido actualizada.');
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Error de actualización', 'Hubo un problema al actualizar la información del usuario.');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                Alert.alert('Error', 'No se encontró el access token.');
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await axios.delete(`https://5394-45-184-102-76.ngrok-free.app/user/${userId}`, { headers });
            Alert.alert('Éxito', 'Usuario eliminado correctamente.');
            setUserData(userData.filter(user => user._id !== userId));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo eliminar el usuario.');
        }
    };
 
    const goToAdminDashboardScreen = () => {
        navigation.navigate('AdminDashboardScreen');
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.imageContainer} onPress={goToAdminDashboardScreen}>
                    <Image source={Assets.patitaback} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.header}>USUARIOS</Text>
                {userData.map((user, index) => (
                    <View key={index} style={styles.userContainer}>
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.input}
                                value={user.firstName}
                                onChangeText={(text) => setUserData(userData.map(u => u._id === user._id ? { ...u, firstName: text } : u))}
                                placeholder="Nombre"
                            />
                            <TextInput
                                style={styles.input}
                                value={user.lastName}
                                onChangeText={(text) => setUserData(userData.map(u => u._id === user._id ? { ...u, lastName: text } : u))}
                                placeholder="Apellido"
                            />
                            <TextInput
                                style={styles.input}
                                value={user.email}
                                editable={false}
                                placeholder="Email"
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                value={user.phoneNumber}
                                onChangeText={(text) => setUserData(userData.map(u => u._id === user._id ? { ...u, phoneNumber: text } : u))}
                                placeholder="Número de Teléfono"
                                keyboardType="phone-pad"
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => handleUpdate(user)}>
                                    <Text style={styles.buttonText}>Actualizar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteUser(user._id)}>
                                    <Text style={styles.buttonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {index < userData.length - 1 && <View style={styles.separator} />}
                    </View>
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F1D47B',
    },
    userContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,

    },
    imageContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    image: {
        width: 40,
        height: 40,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#573321',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#573321',
        textAlign: 'center',
    },
    email: {
        fontSize: 16,
        color: '#573321',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#573321',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#B22222',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#573321',
        marginVertical: 10,
    },
    editContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
        fontSize: 16,
        color: '#000',
    },
});

export default UserListScreen;
