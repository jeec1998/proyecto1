import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, Linking, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';

const VeterinaryDetailScreen = ({ route, navigation }) => {
    const { vetId } = route.params;
    const [vet, setVet] = useState(null);

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
                const response = await axios.get(`https://7bab-2800-bf0-2401-1128-3197-5a95-cf0-630c.ngrok-free.app/veterinaria/${vetId}`, { headers });
                console.log('Response from API:', response.data);

                setVet(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información detallada de la veterinaria.');
            }
        };

        fetchVetDetail();
    }, [vetId]);

    if (!vet) {
        return <Text>Cargando...</Text>;
    }

    const handleRate = () => {
        Alert.alert('Calificar', 'Funcionalidad para calificar con estrellas aún no implementada.');
    };

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
        <ScrollView contentContainerStyle={styles.container}>
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
            <TextInput
                style={styles.descriptionInput}
                placeholder="Descripción"
                placeholderTextColor="gray"
                value={vet.description}
                editable={false}
                multiline
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.smallButton} onPress={handleRate}>
                    <Text style={styles.buttonText}>Calificar</Text>
                </TouchableOpacity>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F1D47B',
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
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    descriptionInput: {
        width: '100%',
        paddingHorizontal: 10,
        color: 'black',
        borderWidth: 0,
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

export default VeterinaryDetailScreen;
