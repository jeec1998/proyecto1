import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import MaskInput from 'react-native-mask-input';
import Assets from './Assets';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModVeterinary = () => {
  const [veterinaryName, setVeterinaryName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [veterinaryContactNumber, setVeterinaryContactNumber] = useState('');
  const [certificateImage, setCertificateImage] = useState(null);
  const [vetImg, setVetImg] = useState(null);
  const navigation = useNavigation();

  const selectFile = async (setter) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      if (res[0].type === 'image/jpeg' || res[0].type === 'image/png' || res[0].type === 'application/pdf') {
        setter(res[0]);
      } else {
        Alert.alert('Formato incorrecto', 'Solo se permiten imágenes JPG, PNG o PDF.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the file picker.');
      } else {
        console.error('Error while picking the file:', err);
      }
    }
  };

  const handleRegister = async () => {
    const data = new FormData();
    data.append('veterinaryName', veterinaryName);
    data.append('description', description);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    data.append('veterinaryContactNumber', `+593${veterinaryContactNumber}`);

    if (certificateImage) {
      data.append('files', {
        uri: certificateImage.uri,
        type: certificateImage.type,
        name: certificateImage.name,
      });
    }

    if (vetImg) {
      data.append('files', {
        uri: vetImg.uri,
        type: vetImg.type,
        name: vetImg.name,
      });
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }
      if (!userId) {
        Alert.alert('Error', 'No se encontró el user ID.');
        return;
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      };

      const response = await axios.post(`https://dd3f-157-100-134-105.ngrok-free.app/veterinaria`, data, { headers });
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

  const setCoordinates = ({ latitude, longitude }) => {
    setLatitude(latitude.toString());
    setLongitude(longitude.toString());
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
          <View style={styles.phoneContainer}>
            <Text style={styles.phonePrefix}>+593</Text>
            <MaskInput
              style={styles.phoneInput}
              placeholder="Número de Contacto"
              placeholderTextColor="#ccc"
              value={veterinaryContactNumber}
              onChangeText={(masked, unmasked) => {
                setVeterinaryContactNumber(unmasked);
              }}
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
              keyboardType="phone-pad"
            />
          </View>
          {!certificateImage ? (
            <TouchableOpacity style={styles.button} onPress={() => selectFile(setCertificateImage)}>
              <Text style={styles.buttonText}>Seleccionar Certificado</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileContainer}>
              <TextInput
                style={styles.smallInput}
                placeholder="Imagen del Certificado Seleccionada"
                placeholderTextColor="#ccc"
                value={certificateImage.name}
                editable={false}
              />
              <TouchableOpacity onPress={() => selectFile(setCertificateImage)} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          )}
          {!vetImg ? (
            <TouchableOpacity style={styles.button} onPress={() => selectFile(setVetImg)}>
              <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileContainer}>
              <TextInput
                style={styles.smallInput}
                placeholder="Imagen Seleccionada"
                placeholderTextColor="#ccc"
                value={vetImg.name}
                editable={false}
              />
              <TouchableOpacity onPress={() => selectFile(setVetImg)} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          )}
          {(!latitude || !longitude) ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('SelectLocation', { setCoordinates })}
            >
              <Text style={styles.buttonText}>Seleccionar Ubicación</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileContainer}>
              <TextInput
                style={styles.smallInput}
                placeholder="Latitud"
                placeholderTextColor="#ccc"
                value={latitude}
                editable={false}
              />
              <TextInput
                style={styles.smallInput}
                placeholder="Longitud"
                placeholderTextColor="#ccc"
                value={longitude}
                editable={false}
              />
              <TouchableOpacity onPress={() => navigation.navigate('SelectLocation', { setCoordinates })} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
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
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  smallInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  smallButton: {
    backgroundColor: '#573321',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ModVeterinary;
