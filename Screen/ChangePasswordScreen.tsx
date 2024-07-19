import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Assets from './Assets';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden.');
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

      const response = await axios.patch('https://dd3f-157-100-134-105.ngrok-free.app/user/change-password', {
        currentPassword,
        newPassword,
      }, { headers });

      Alert.alert('Éxito', 'La contraseña ha sido actualizada.');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Hubo un problema al cambiar la contraseña.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={Assets.logoImage} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <Text style={[styles.header, styles.textBlack]}>Cambiar Contraseña</Text>
          <TextInput
            style={[styles.input, styles.textBlack]}
            placeholder="Contraseña Actual"
            placeholderTextColor="#ccc"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, styles.textBlack]}
            placeholder="Nueva Contraseña"
            placeholderTextColor="#ccc"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, styles.textBlack]}
            placeholder="Confirmar Nueva Contraseña"
            placeholderTextColor="#ccc"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1D47B',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -400,
},
logo: {
    width: 500, // Agrandar el logo
    height: 500,
    resizeMode: 'contain',
},
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -200, // Ajustar la posición del formulario
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textBlack: {
    color: 'black',
  },
  button: {
    backgroundColor: '#573321',
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    position: 'absolute', // Posiciona el botón encima del logo
    top: 260, // Ajustar la posición del botón
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
