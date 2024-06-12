import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import Assets from './Assets';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const FirstScreen = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user`);
                const { name, lastName, email, phone } = response.data;
                setName(name);
                setLastName(lastName);
                setEmail(email);
                setPhone(phone);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        const updatedUserData = {
            name,
            lastName,
            phone,
            password,
        };

        try {
            await axios.put(`${API_URL}/user`, updatedUserData);
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
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: '#e0e0e0' }]}
                    placeholder="Correo Electrónico"
                    value={email}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número de Teléfono"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
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
        width: 500,
        height: 500,
        resizeMode: 'contain',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
        marginTop: -200,
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

export default FirstScreen;
