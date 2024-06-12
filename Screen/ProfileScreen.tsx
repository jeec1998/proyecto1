import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Assets from './Assets';


const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Perfil del Usuario</Text>
            <View style={styles.profileInfo}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.info}>John Doe</Text>
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.label}>Correo Electrónico:</Text>
                <Text style={styles.info}>johndoe@example.com</Text>
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.label}>Número de Teléfono:</Text>
                <Text style={styles.info}>+1234567890</Text>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileInfo: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
    },
});

export default ProfileScreen;
