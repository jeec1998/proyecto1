import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, Linking, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';
import Assets from './Assets';

const VeterinaryDetailScreen = ({ route, navigation }) => {
    const { vetId } = route.params;
    const [vet, setVet] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchVetDetail = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    Alert.alert('Error', 'No se encontró el access token.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get(`https://e9a1-45-184-102-78.ngrok-free.app/veterinaria/${vetId}`, { headers });
                console.log('Response from API:', response.data);

                setVet(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información detallada de la veterinaria.');
            }
        };

        fetchVetDetail();
    }, [vetId]);

    const onRatingCompleted = (rating) => {
        setRating(rating);
        // Aquí puedes hacer cualquier cosa adicional con la calificación, como enviarla a una API
    };

    if (!vet) {
        return <Text>Cargando...</Text>;
    }

    const handleMessage = () => {
        if (!vet.veterinaryContactNumber) {
            Alert.alert('Error', 'El número de teléfono no está disponible.');
            return;
        }
       
        const url = `whatsapp://send?phone=${vet.veterinaryContactNumber}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de tener WhatsApp instalado.');
        });
    };

    const handleCall = () => {
        if (!vet.veterinaryContactNumber) {
            Alert.alert('Error', 'El número de teléfono no está disponible.');
            return;
        }
        const url = `tel:${vet.veterinaryContactNumber}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'No se pudo realizar la llamada.');
        });
    };

    const handleNavigate = () => {
        navigation.navigate('First', { destination: vet.location }); 
    };

    const gotoFirstScreen = () => {
        navigation.navigate('First');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.imageContainer} onPress={gotoFirstScreen}>
                    <Image source={Assets.patitaback} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.name}>{vet.veterinaryName}</Text>
                {vet.imagVet && (
                    <Image 
                        source={{ uri: vet.imagVet }} 
                        style={styles.vetImage} 
                    />
                )}
                <Rating
                    startingValue={0}
                    showRating
                    type='custom'
                    onFinishRating={onRatingCompleted}
                    style={styles.starRatingContainer}
                    imageSize={40}
                    tintColor="#F1D47B"
                    ratingColor="#573321" // Color de las estrellas cuando no están seleccionadas
                    selectedColor="#573321" // Color de las estrellas cuando se seleccionan
                    ratingTextColor="#000000" // Color del texto del ranking
                />
                <TextInput
                    style={styles.descriptionInput}
                    placeholder="Descripción"
                    placeholderTextColor="gray"
                    value={vet.description}
                    editable={false}
                    multiline
                />
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.smallButton} onPress={handleMessage}>
                    <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={handleCall}>
                    <Text style={styles.buttonText}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={handleNavigate}>
                    <Text style={styles.buttonText}>IR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1D47B',
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontStyle: 'italic',
        color: '#573321',
    },
    vetImage: {
        width: '100%',
        height: 300, // Ajusta la altura para mejorar la visibilidad de la imagen
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 10, // Opcional: para dar bordes redondeados a la imagen
    },
    descriptionInput: {
        width: '100%',
        paddingHorizontal: 10,
        color: 'black',
        borderWidth: 0,
    },
    starRatingContainer: {
        marginVertical: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
        color: '#573321',
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
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#F1D47B',
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

export default VeterinaryDetailScreen;
