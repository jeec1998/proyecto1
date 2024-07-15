import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const TopVetScreen = () => {
    const [vetName, setVetName] = useState('');
    const [vetImage, setVetImage] = useState(null); // Aquí puedes usar un estado para la imagen
    const [vetDescription, setVetDescription] = useState('');
    const navigation = useNavigation();

  /*   useEffect(() => {
        const fetchVetInfo = async () => {
            try {
                const response = await axios.get(`https://7118-170-238-1-36.ngrok-free.app bb-2800-bf0-2401-1128-996c-18a1-e2d-428d.ngrok-free.app/veterinary`);
                const { name, image, description } = response.data;
                setVetName(name);
                setVetImage(image); // Asumiendo que 'image' es la URL de la imagen
                setVetDescription(description);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de la veterinaria.');
            }
        };

        fetchVetInfo();
    }, []); */



    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {vetImage && <Image source={{ uri: vetImage }} style={styles.logo} />}
            </View>
            <Text style={styles.header}>{vetName}</Text>
            <Text style={styles.description}>{vetDescription}</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la veterinaria"
                    value={vetName}
                    onChangeText={setVetName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descripción"
                    value={vetDescription}
                    onChangeText={setVetDescription}
                    multiline
                />
             {/*    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Actualizar Información</Text>
                </TouchableOpacity> */}
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
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
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

export default TopVetScreen ;
