import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';
import { API_URL } from '@env';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const loginData = { email, password };
    try {
      const response = await axios.post(`https://2ff2-157-100-134-104.ngrok-free.app/auth/login`, loginData);

      console.log('Respuesta del servidor:', response.data);
      const accessToken = response.data.data.accessToken;

      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken); // Guarda el token en AsyncStorage
        Alert.alert('Login exitoso', 'Bienvenido');
        navigation.navigate('First');
      } else {
        Alert.alert('Error de inicio de sesión', 'No se recibió accessToken del servidor');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data); // Verifica la respuesta de error del servidor
      }
      Alert.alert('Error de inicio de sesión', 'Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  const gotoFirstScreen = () => {
    navigation.navigate('First');
  };

  const goToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image source={Assets.backgroundImage} style={styles.backgroundImage} />
      <TouchableOpacity style={styles.imageContainer} onPress={gotoFirstScreen}>
        <Image source={Assets.patitaback} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={goToRegisterScreen}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  loginContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#573321',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#293446',
  },
});

export default LoginScreen;
