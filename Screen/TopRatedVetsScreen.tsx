import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import { AuthContext } from './AuthContext';
import Assets from './Assets';
import { API_URL } from '@env';

const TopRatedVetsScreen = ({ navigation }) => {
    const [topVets, setTopVets] = useState([]);
    const { accessToken } = useContext(AuthContext); 

    const goToFirstScren = () => {
        navigation.navigate('First');
    };

    useEffect(() => {
        const fetchTopRatedVets = async () => {
            try {
                if (!accessToken) {
                    Alert.alert('Error', 'No se encontró el access token.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${accessToken}`
                };
                const response = await axios.get(`https://08c2-181-199-59-134.ngrok-free.app/veterinaria/top-rated`, { headers });
                console.log('Response from API:', response.data);

                setTopVets(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la lista de veterinarias mejor puntuadas.');
            }
        };

        fetchTopRatedVets();
    }, [accessToken]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>TOP 5</Text>
                <TouchableOpacity style={styles.imageContainer} onPress={goToFirstScren}>
                    <Image source={Assets.patitaback} style={styles.image} />
                </TouchableOpacity>
                {topVets.map((vet, index) => (
                    <View key={index} style={styles.vetContainer}>
                        <Text style={styles.name}>{vet.veterinaryName}</Text>
                        {vet.imagVet && (
                            <Image 
                                source={{ uri: vet.imagVet }} 
                                style={styles.vetImage} 
                            />
                        )}
                        <Rating
                            startingValue={vet.averageScore}
                            imageSize={20}
                            readonly
                            style={styles.rating}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1D47B',
    },
    scrollContainer: {
        padding: 10,
        paddingTop: 10, // Add padding to top to ensure header does not overlap
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#573321',
    },
    vetContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#573321',
    },
    vetImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 10,
    },
    rating: {
        alignSelf: 'flex-start',
    },
    image: {
        width: 40,
        height: 40,
    },
    imageContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
});

export default TopRatedVetsScreen;
