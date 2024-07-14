import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';

const VeterinaryDetailScreen = ({ route, navigation }) => {
    const { vet } = route.params;

    const handleRate = () => {
        Alert.alert('Calificar', 'Funcionalidad para calificar con estrellas aún no implementada.');
    };

    const handleMessage = () => {
        Alert.alert('Enviar Mensaje', 'Funcionalidad para enviar mensaje aún no implementada.');
    };

    const handleNavigate = () => {
        navigation.navigate('FirstScreen'); 
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
        fontStyle: 'italic', // Aplica el estilo cursiva
        color: '#573321', // Aplica un color específico
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
        color: 'black', // Asegura que el texto sea de color negro
        borderWidth: 0, // Quita el borde
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
