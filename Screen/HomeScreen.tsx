import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import Assets from './Assets';
import LoginScreen from './LoginScreen';

const HomeScreen = () => {
  const navigation = useNavigation(); // Obtiene el objeto de navegación

  const goToLoginScreen = () => {
    navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
  };

  return (
    <View style={styles.container}>
      <Image source={Assets.backgroundImage} style={styles.backgroundImage} />
      <View style={styles.logoContainer}>
        <Image source={Assets.logoImage} style={styles.logo} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToLoginScreen}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Distribuye el espacio entre los elementos
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',  // Cambia resizeMode a 'cover'
  },
  logoContainer: {
    marginTop: -250, // Ajusta el margen superior según sea necesario
    alignItems: 'center', // Alinea el contenido del contenedor del logo
  },
  logo: {
    width: 800, // Ajusta el ancho del logo según sea necesario
    height: 800, // Ajusta la altura del logo según sea necesario
    resizeMode: 'contain', // Asegura que la imagen del logo mantenga su relación de aspecto
  },
  buttonContainer: {
    marginBottom: 50, // Ajusta el margen inferior según sea necesario
  },
  button: {
    backgroundColor: '#573321',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
