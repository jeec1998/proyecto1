import React, { useState } from 'react';
import { StyleSheet, View, Text,TextInput, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker'; // Import document picker
import Assets from './Assets';
import { API_URL } from '@env';

const ModVeterinary = () => {
  const [veterinaryName, setVeterinaryName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [veterinaryContactNumber, setVeterinaryContactNumber] = useState('');
  const [certificatePdf, setCertificatePdf] = useState(null); // State to hold the selected PDF file
  const navigation = useNavigation();

  // Function to handle file selection
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setCertificatePdf(res); // Set the selected file
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the file picker.');
      } else {
        console.error('Error while picking the file:', err);
      }
    }
  };

  // Function to handle form submission
  const handleRegister = async () => {
    const formData = new FormData();
    formData.append('veterinaryName', veterinaryName);
    formData.append('description', description);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('veterinaryContactNumber', veterinaryContactNumber);
    
    if (certificatePdf) {
        formData.append('certificatePdf', {
            uri: certificatePdf.uri,
            type: certificatePdf.type,
            name: certificatePdf.name
        });
    }

    try {
      const response = await axios.post(`${API_URL}/veterinaria`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Registro exitoso');
      navigation.navigate('First');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error de registro',
        'Hubo un problema al registrar la veterinaria. Por favor, inténtalo de nuevo.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={Assets.backgroundImage} style={styles.backgroundImage} />
        <TouchableOpacity style={styles.imageContainer} onPress={() => navigation.navigate('First')}>
          <Image source={Assets.patitaback} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la Veterinaria"
            placeholderTextColor="#ccc"
            value={veterinaryName}
            onChangeText={setVeterinaryName}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción de la Veterinaria"
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitud"
            placeholderTextColor="#ccc"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitud"
            placeholderTextColor="#ccc"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Número de Contacto de la Veterinaria"
            placeholderTextColor="#ccc"
            value={veterinaryContactNumber}
            onChangeText={setVeterinaryContactNumber}
            keyboardType="phone-pad"
          />
          {/* File picker button */}
          <TouchableOpacity style={styles.button} onPress={selectFile}>
            <Text style={styles.buttonText}>Seleccionar PDF</Text>
          </TouchableOpacity>
          {/* Display selected file name */}
          {certificatePdf && (
            <Text style={styles.selectedFile}>{certificatePdf.name}</Text>
          )}
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
  selectedFile: {
    fontSize: 14,
    marginVertical: 10,
  },
});

export default ModVeterinary;
