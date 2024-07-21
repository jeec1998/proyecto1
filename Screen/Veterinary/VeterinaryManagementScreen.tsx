import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from '../Assets';

const VeterinaryManagementScreen = () => {
    const [vetData, setVetData] = useState([]);
    const [editingVetId, setEditingVetId] = useState(null);
    const [editVetData, setEditVetData] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;

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
                const response = await axios.get(`https://fd0a-157-100-134-105.ngrok-free.app/veterinaria/user/${userId}`,{headers});
                setVetData(response.data);
           console.log(userId);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la información de la veterinaria.');
            }
        };

        fetchVetData();
    }, [userId]);

    const handleEdit = (vetId) => {
        const vet = vetData.find(v => v._id === vetId);
        setEditVetData(vet);
        setEditingVetId(vetId);
    };

    const handleSave = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                Alert.alert('Error', 'No se encontró el access token.');
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const body = {
                veterinaryName: editVetData.veterinaryName,
                description: editVetData.description,
                veterinaryContactNumber: editVetData.veterinaryContactNumber,
            };
            await axios.patch(`https://fd0a-157-100-134-105.ngrok-free.app/veterinaria/${editingVetId}`, body, { headers });
            Alert.alert('Éxito', 'Veterinaria actualizada correctamente.');
            setVetData(vetData.map(vet => (vet._id === editingVetId ? editVetData : vet)));
            setEditingVetId(null);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar la veterinaria.');
        }
    };

    const handleDeleteVet = async (vetId) => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (!accessToken) {
                Alert.alert('Error', 'No se encontró el access token.');
                return;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            await axios.delete(`https://fd0a-157-100-134-105.ngrok-free.app/veterinaria/${vetId}`, { headers });
            Alert.alert('Éxito', 'Veterinaria eliminada correctamente.');
            setVetData(vetData.filter(vet => vet._id !== vetId));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo eliminar la veterinaria.');
        }
    };

    const gotoFirstScreen = () => {
        navigation.navigate('First');
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.imageContainer} onPress={gotoFirstScreen}>
                    <Image source={Assets.patitaback} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.header}>  MIS VETERINARIAS</Text>
                {vetData.map((vet, index) => (
                    <View key={index} style={styles.vetContainer}>
                        {editingVetId === vet._id ? (
                            <View style={styles.editContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={editVetData.veterinaryName}
                                    onChangeText={(text) => setEditVetData({ ...editVetData, veterinaryName: text })}
                                    placeholder="Nombre de la veterinaria"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editVetData.description}
                                    onChangeText={(text) => setEditVetData({ ...editVetData, description: text })}
                                    placeholder="Descripción"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editVetData.veterinaryContactNumber}
                                    onChangeText={(text) => setEditVetData({ ...editVetData, veterinaryContactNumber: text })}
                                    placeholder="Número de contacto"
                                    keyboardType="phone-pad"
                                    
                                />
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                                        <Text style={styles.buttonText}>Guardar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditingVetId(null)}>
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View>
                                
                                    <Text style={styles.name}>{vet.veterinaryName}</Text>
                            
                                    {vet.imagVet && (
                                        <Image 
                                            source={{ uri: vet.imagVet }} 
                                            style={styles.vetImage} 
                                        />
                                    )}
                             
                                <Text style={styles.description}>{vet.description}</Text>
                                <Text style={styles.contactNumber}>Contacto: {vet.veterinaryContactNumber}</Text>
                                <Text style={styles.location}>Ubicación: {vet.latitude}, {vet.longitude}</Text>
                                <Text style={styles.verified}>Verificado: {vet.isVerified ? 'Sí' : 'No'}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => handleEdit(vet._id)}>
                                        <Text style={styles.buttonText}>Actualizar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteVet(vet._id)}>
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {index < vetData.length - 1 && <View style={styles.separator} />}
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
    vetContainer: {
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#573321',
        textAlign: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#573321',
    },
    vetImage: {
        width: 300,
        height: 300,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#573321',
        marginBottom: 10,
        textAlign: 'center',
    },
    contactNumber: {
        fontSize: 16,
        color: '#573321',
        marginBottom: 10,
        textAlign: 'center',
    },
    location: {
        fontSize: 16,
        color: '#573321',
        marginBottom: 10,
        textAlign: 'center',
    },
    verified: {
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
    cancelButton: {
        backgroundColor: '#A9A9A9',
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

export default VeterinaryManagementScreen;
