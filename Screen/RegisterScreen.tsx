import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Assets from './Assets';
import { API_URL } from '@env';
import MaskInput from 'react-native-mask-input';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const apiUrl = process.env.API_URL;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber: `+593${phoneNumber}`, // Agrega el código de país
      password,
    };

    try {
      const response = await axios.post(`https://dd3f-157-100-134-105.ngrok-free.app/auth/register`, userData);
      Alert.alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error de registro', 'Hubo un problema al registrar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  const goToLoginScreen = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={Assets.backgroundImage} style={styles.backgroundImage} />
        <TouchableOpacity style={styles.imageContainer} onPress={goToLoginScreen}>
          <Image source={Assets.patitaback} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#ccc"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.phoneContainer}>
            <Text style={styles.phonePrefix}>+593</Text>
            <MaskInput
              style={styles.phoneInput}
              placeholder="Número de Teléfono"
              placeholderTextColor="#ccc"
              value={phoneNumber}
              onChangeText={(masked, unmasked) => {
                setPhoneNumber(unmasked);
              }}
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showPasswordText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#ccc"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.showPasswordText}>{showConfirmPassword ? 'Ocultar' : 'Ver'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  registerContainer: {
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
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  phonePrefix: {
    fontSize: 16,
    color: '#000',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  showPasswordText: {
    marginLeft: 10,
    color: '#000',
    fontSize: 16,
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
});

export default RegisterScreen;
