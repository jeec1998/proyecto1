import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VeterinaryManagementScreen = () => {
  const [veterinaries, setVeterinaries] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

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

        const response = await axios.get('https://0a83-2801-16-4800-5220-5915-790b-3bc4-f8f3.ngrok-free.app/veterinaria', { headers });
        setVeterinaries(response.data);
      } catch (error) {
        console.error('Error fetching veterinaries:', error);
        Alert.alert('Error', 'No se pudieron obtener las veterinarias.');
      }
    };

    fetchVeterinaries();
  }, []);

  const handleAddVeterinary = async () => {
    if (!name || !address || !phoneNumber) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.post('https://0a83-2801-16-4800-5220-5915-790b-3bc4-f8f3.ngrok-free.app/veterinaria', {
        name,
        address,
        phoneNumber,
      }, { headers });

      setVeterinaries([...veterinaries, response.data]);
      setName('');
      setAddress('');
      setPhoneNumber('');
      Alert.alert('Éxito', 'Veterinaria añadida exitosamente.');
    } catch (error) {
      console.error('Error adding veterinary:', error);
      Alert.alert('Error', 'Hubo un problema al añadir la veterinaria.');
    }
  };

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

      await axios.delete(`https://0a83-2801-16-4800-5220-5915-790b-3bc4-f8f3.ngrok-free.app/veterinaria/${id}`, { headers });
      setVeterinaries(veterinaries.filter(vet => vet._id !== id));
      Alert.alert('Éxito', 'Veterinaria eliminada exitosamente.');
    } catch (error) {
      console.error('Error deleting veterinary:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la veterinaria.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Administrar Veterinarias</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, styles.textBlack]}
          placeholder="Nombre de la Veterinaria"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.textBlack]}
          placeholder="Dirección"
          placeholderTextColor="#ccc"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={[styles.input, styles.textBlack]}
          placeholder="Número de Teléfono"
          placeholderTextColor="#ccc"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddVeterinary}>
          <Text style={styles.buttonText}>Añadir Veterinaria</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textBlack: {
    color: 'black',
  },
  button: {
    backgroundColor: '#573321',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default VeterinaryManagementScreen;
