import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          Alert.alert('Error', 'No se encontró el access token.');
          return;
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.get('https://80e8-157-100-134-105.ngrok-free.app/users', { headers });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'No se pudieron obtener los usuarios.');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.delete(`https://80e8-157-100-134-105.ngrok-free.app/users/${id}`, { headers });
      setUsers(users.filter(user => user._id !== id));
      Alert.alert('Éxito', 'Usuario eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userText}>{item.email}</Text>
            <Text style={styles.userText}>{item.phoneNumber}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item._id)}>
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
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  userText: {
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

export default UserListScreen;
