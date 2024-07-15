import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VeterinaryRequestsScreen = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
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
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        Alert.alert('Error', 'No se pudieron obtener las solicitudes de veterinarias.');
      }
    };

    fetchRequests();
  }, []);

  const handleApproveRequest = async (id) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.patch(`https://0a83-2801-16-4800-5220-5915-790b-3bc4-f8f3.ngrok-free.app/veterinaria/${id}/approve`, {}, { headers });
      setRequests(requests.filter(request => request._id !== id));
      Alert.alert('Éxito', 'Solicitud de veterinaria aprobada exitosamente.');
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Hubo un problema al aprobar la solicitud de veterinaria.');
    }
  };

  const handleDeleteRequest = async (id) => {
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
      setRequests(requests.filter(request => request._id !== id));
      Alert.alert('Éxito', 'Solicitud de veterinaria eliminada exitosamente.');
    } catch (error) {
      console.error('Error deleting request:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la solicitud de veterinaria.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Solicitudes de Veterinarias</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestText}>{item.name}</Text>
            <Text style={styles.requestText}>{item.address}</Text>
            <Text style={styles.requestText}>{item.phoneNumber}</Text>
            <TouchableOpacity style={styles.approveButton} onPress={() => handleApproveRequest(item._id)}>
              <Text style={styles.buttonText}>Aprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(item._id)}>
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
  requestItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VeterinaryRequestsScreen;
