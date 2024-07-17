import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NormalVeterinaryListScreen = () => {
  const [veterinaries, setVeterinaries] = useState([]);

  useEffect(() => {
    const fetchVeterinaries = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          Alert.alert('Error', 'No se encontró el access token.');
          return;
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.get('https://7bab-2800-bf0-2401-1128-3197-5a95-cf0-630c.ngrok-free.app/veterinaria', { headers });
        setVeterinaries(response.data);
      } catch (error) {
        console.error('Error fetching veterinaries:', error);
        Alert.alert('Error', 'No se pudieron obtener las veterinarias.');
      }
    };

    fetchVeterinaries();
  }, []);

  const handleDeleteVeterinary = async (id) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.delete(`https://7bab-2800-bf0-2401-1128-3197-5a95-cf0-630c.ngrok-free.app/veterinaries/${id}`, { headers });
      setVeterinaries(veterinaries.filter(vet => vet._id !== id));
      Alert.alert('Éxito', 'Veterinaria eliminada exitosamente.');
    } catch (error) {
      console.error('Error deleting veterinary:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la veterinaria.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Veterinarias Normales</Text>
      <FlatList
        data={veterinaries}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.vetItem}>
            <Text style={styles.vetText}>{item.name}</Text>
            <Text style={styles.vetText}>{item.address}</Text>
            <Text style={styles.vetText}>{item.phoneNumber}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteVeterinary(item._id)}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  vetItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  vetText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NormalVeterinaryListScreen;
