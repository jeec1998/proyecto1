// VeterinaryDetailScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, Linking, TextInput } from 'react-native';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';
import { AuthContext } from './AuthContext';
import { API_URL } from '@env';
const VeterinaryDetailScreen = ({ route, navigation }) => {
    const { vetId } = route.params;
    const [vet, setVet] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const { accessToken } = useContext(AuthContext); 
    const { userId } = route.params;

    useEffect(() => {
        const fetchVetDetail = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!accessToken || !userId) {
                    Alert.alert('Error', 'No se encontró el access token o el ID del usuario.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get(`https://5394-45-184-102-76.ngrok-free.app/veterinaria/${vetId}`, { headers });
                console.log('Response from API:', response.data);

                setVet(response.data);
                
                const userRate = response.data.rate.find(rate => rate.userId === userId);
                if (userRate) {
                    setUserRating(userRate.score);
                }

            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información detallada de la veterinaria.');
            }
        };

        fetchVetDetail();
    }, [vetId, accessToken]);

    const onRatingCompleted = async (rating) => {
        setUserRating(rating);

        try {
            const accesToken = await AsyncStorage.getItem('accesToken');
            if (!accessToken ) {
                Alert.alert('Error', 'No se encontró el access token o el ID del usuario.');
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`
            };

            const rateData = {
                userId: userId,
                score: rating
            };

            const response = await axios.patch(`https://5394-45-184-102-76.ngrok-free.app/veterinaria/rate/${vetId}`, rateData, { headers });

            setVet(response.data);
            Alert.alert('Éxito', 'Tu calificación ha sido enviada.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo enviar tu calificación.');
        }
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

    const goToVeterinarysScreen = () => {
        navigation.navigate('VeterinarysScreen');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.imageContainer} onPress={goToVeterinarysScreen}>
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
                    startingValue={userRating}
                    showRating
                    type='custom'
                    onFinishRating={onRatingCompleted}
                    style={styles.starRatingContainer}
                    imageSize={40}
                    tintColor="#F1D47B"
                    ratingColor="#573321"
                    selectedColor="#573321"
                    ratingTextColor="#000000"
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
        height: 300,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 10,
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
    averageScoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#573321',
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
