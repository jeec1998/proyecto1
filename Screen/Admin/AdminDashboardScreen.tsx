import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Assets from '../Assets';
import { API_URL } from '@env';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const goToFirstScren = () => {
    navigation.navigate('First');
};
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.imageContainer} onPress={goToFirstScren}>
                    <Image source={Assets.patitaback} style={styles.image} />
        </TouchableOpacity>
      <Text style={styles.header}>Panel de Administrador</Text>
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('VeterinaryRequestsScreen')}
        >
          <Text style={styles.buttonText}>Ver Solicitudes de Veterinarias</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NormalVeterinaryListScreen')}
        >
          <Text style={styles.buttonText}>Ver Veterinarias</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UserListScreen')}
        >
          <Text style={styles.buttonText}>Ver Usuarios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1D47B',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -100,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000', // Color negro para el texto
    position: 'absolute', // Hace que el texto se posicione de forma absoluta
    top: 150, // Ajusta esta distancia según sea necesario
  },
  button: {
    backgroundColor: '#573321',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default AdminDashboardScreen;
