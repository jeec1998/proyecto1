import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import Assets from './Assets';
import { API_URL } from '@env';

const ModVeterinary = () => {
  const [veterinaryName, setVeterinaryName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [veterinaryContactNumber, setVeterinaryContactNumber] = useState('');
  const [certificatePdf, setCertificatePdf] = useState(null);
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setCertificatePdf(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the file picker.');
      } else {
        console.error('Error while picking the file:', err);
      }
    }
  };

  const selectImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      if (res[0].type === 'image/jpeg' || res[0].type === 'image/png') {
        setImage(res);
      } else {
        Alert.alert('Formato incorrecto', 'Solo se permiten imágenes JPG o PNG.');
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
    const formData = new FormData();
    formData.append('veterinaryName', veterinaryName);
    formData.append('description', description);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('veterinaryContactNumber', veterinaryContactNumber);

    if (image) {
      formData.append('image', {
        uri: image[0].uri,
        type: image[0].type,
        name: image[0].name,
      });
    }

    if (certificatePdf) {
      formData.append('certificatePdf', {
        uri: certificatePdf.uri,
        type: certificatePdf.type,
        name: certificatePdf.name,
      });
    }

    try {
      const response = await axios.post(`https://f86a-170-238-1-36.ngrok-free.app /veterinaria`, formData, {
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
          <TextInput
            style={styles.input}
            placeholder="Número de Contacto de la Veterinaria"
            placeholderTextColor="#ccc"
            value={veterinaryContactNumber}
            onChangeText={setVeterinaryContactNumber}
            keyboardType="phone-pad"
          />
          {!certificatePdf ? (
            <TouchableOpacity style={styles.button} onPress={selectFile}>
              <Text style={styles.buttonText}>Seleccionar PDF</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileContainer}>
              <TextInput
                style={styles.smallInput}
                placeholder="PDF Seleccionado"
                placeholderTextColor="#ccc"
                value={certificatePdf[0].name}
                editable={false}
              />
              <TouchableOpacity onPress={selectFile} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          )}
          {!image ? (
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileContainer}>
              <TextInput
                style={styles.smallInput}
                placeholder="Imagen Seleccionada"
                placeholderTextColor="#ccc"
                value={image[0].name}
                editable={false}
              />
              <TouchableOpacity onPress={selectImage} style={styles.smallButton}>
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
