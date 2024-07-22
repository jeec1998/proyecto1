// LoginScreen.js
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';
import { AuthContext } from './AuthContext';
import { API_URL } from '@env';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const { setAccessToken } = useContext(AuthContext); // Obtener la función setAccessToken del contexto
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setPassword('');
      };
    }, [])
  );

  const handleLogin = async () => {
    const loginData = { email, password };
    try {
      const response = await axios.post(`${API_URL}/auth/login`, loginData);

      console.log('Respuesta del servidor:', response.data);
      const accessToken = response.data.data.accessToken;
      const isTwoFactorAuthenticationEnabled = response.data.data.isTwoFactorAuthenticationEnabled;

      if (isTwoFactorAuthenticationEnabled) {
        setIsTwoFactorEnabled(true);
        await AsyncStorage.setItem('accessToken', accessToken); // Guarda el token en AsyncStorage
        await sendTwoFactorCode(accessToken);
      } else if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken); // Guarda el token en AsyncStorage
        setAccessToken(accessToken); // Guarda el token en el contexto
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

  const sendTwoFactorCode = async (accessToken) => {
    try {
      await axios.get(`${API_URL}/2fa/send-code`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      Alert.alert('Código de verificación enviado', 'Por favor, revisa tu teléfono para el código de verificación.');
    } catch (error) {
      console.error('Error al enviar el código de 2FA:', error);
      Alert.alert('Error', 'No se pudo enviar el código de verificación. Por favor, inténtalo de nuevo.');
    }
  };

  const verifyTwoFactorCode = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    try {
      const response = await axios.post(`${API_URL}/2fa/verify`, { code: twoFactorCode }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.success) {
        setAccessToken(accessToken); // Guarda el token en el contexto
        Alert.alert('Verificación exitosa', 'Bienvenido');
        navigation.navigate('First');
      } else {
        Alert.alert('Error de verificación', 'Código incorrecto. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error en la verificación del código de 2FA:', error);
      Alert.alert('Error', 'No se pudo verificar el código. Por favor, inténtalo de nuevo.');
    }
  };

  const gotoHomeScreen = () => {
    navigation.navigate('Home');
  };

  const goToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image source={Assets.backgroundImage} style={styles.backgroundImage} />
      <TouchableOpacity style={styles.imageContainer} onPress={gotoHomeScreen}>
        <Image source={Assets.patitaback} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        {!isTwoFactorEnabled ? (
          <>
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
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Código de Verificación"
              placeholderTextColor="#ccc"
              value={twoFactorCode}
              onChangeText={setTwoFactorCode}
              keyboardType="numeric"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={verifyTwoFactorCode}>
              <Text style={styles.buttonText}>Verificar Código</Text>
            </TouchableOpacity>
          </>
        )}
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
