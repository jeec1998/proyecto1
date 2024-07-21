import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';

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
                const response = await axios.get(`https://e0b2-2800-bf0-2401-38c-e4bb-98c1-2836-d32e.ngrok-free.app/veterinaria`, { headers });
                console.log('Response from API:', response.data);

                setVetData(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de la veterinaria.');
            }
        };

        fetchVetData();
    }, []);

    const handleVetDetail = (vetId) => {
        navigation.navigate('VeterinaryDetailScreen', { vetId });
    };
    const gotoFirstScreen = () => {
        navigation.navigate('First');
      };
    return (
        <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={gotoFirstScreen}>
        <Image source={Assets.patitaback} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.header}>VETERINARIAS</Text>
            {vetData.map((vet, index) => (
                <View key={index} style={styles.vetContainer}>
                    <TouchableOpacity onPress={() => handleVetDetail(vet._id)}>
                        <Text style={styles.name}>{vet.veterinaryName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleVetDetail(vet._id)}>
                        {vet.imagVet && (
                            <Image 
                                source={{ uri: vet.imagVet }} 
                                style={styles.vetImage} 
                            />
                        )}
                    </TouchableOpacity>
                    {index < vetData.length - 1 && <View style={styles.separator} />}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F1D47B',
        padding: 10,
        alignItems: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#573321',
    },
    vetContainer: {
        marginBottom: 1,
        width: '100%',
        alignItems: 'center',
        marginTop:+10,
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#573321',
        textAlign: 'center',
    },
    vetImage: {
        width: 300, // Ajuste el tamaño de la imagen
        height: 300,
        resizeMode: 'cover',
        marginBottom: 10,
        
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#573321',
        marginVertical: 10,
    },
});

export default VeterinarysScreen;
