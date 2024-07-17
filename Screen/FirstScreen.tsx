import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Modal, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapComponent from './MapComponent';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const FirstScreen = () => {
  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: -1.66355,
    longitude: -78.6546,
  });
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [veterinaries, setVeterinaries] = useState([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [simulatedLocation, setSimulatedLocation] = useState(location); // Estado para la ubicación simulada
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    requestLocationPermission();
    fetchVeterinaries();
    fetch2FAStatus();

    const locationWatcher = Geolocation.watchPosition(
      (position) => {
        const current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(current);
        setSimulatedLocation(current); // Inicializar la ubicación simulada
      },
      (error) => {
        Alert.alert('Error al obtener la ubicación:', error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      }
    );

    return () => {
      Geolocation.clearWatch(locationWatcher);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLocation((prevLocation) => {
        const newLatitude = prevLocation.latitude + 0.0001; // Simular un cambio en la latitud
        const newLongitude = prevLocation.longitude + 0.0001; // Simular un cambio en la longitud
        return { latitude: newLatitude, longitude: newLongitude };
      });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (route.params?.destination) {
      const destination = route.params.destination;
      const foundVeterinary = veterinaries.find(vet => 
        vet.latitude === destination.latitude && vet.longitude === destination.longitude
      );
      if (foundVeterinary) {
        setSelectedDestination(foundVeterinary);
      } else {
        setSelectedDestination(destination);
      }
    }
  }, [route.params?.destination, veterinaries]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de ubicación",
            message: "Esta aplicación necesita acceso a tu ubicación",
            buttonNeutral: "Preguntar luego",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permiso de ubicación concedido");
        } else {
          console.log("Permiso de ubicación denegado");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const fetchVeterinaries = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      const response = await axios.get(`https://7bab-2800-bf0-2401-1128-3197-5a95-cf0-630c.ngrok-free.app/veterinaria`, { headers });
      setVeterinaries(response.data);
    } catch (error) {
      Alert.alert('Error al cargar las ubicaciones de las veterinarias:', error.message);
    }
  };

  const fetch2FAStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      const response = await axios.get(`https://7bab-2800-bf0-2401-1128-3197-5a95-cf0-630c.ngrok-free.app/2fa/generate`, { headers });
      setIs2FAEnabled(response.data.is2FAEnabled);
    } catch (error) {
      Alert.alert('Error al obtener el estado del 2FA:', error.message);
    }
  };

  const toggle2FA = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'No se encontró el access token.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      const response = await axios.post(`https://7bab-2800-bf0-2401-1128-3197-5a95-cf0-630c.ngrok-free.app/2fa/enable`, {}, { headers });
      setIs2FAEnabled(response.data.is2FAEnabled);
      Alert.alert('Éxito', `Doble factor de autenticación ${response.data.is2FAEnabled ? 'activado' : 'desactivado'}`);
    } catch (error) {
      Alert.alert('Error al cambiar el estado del 2FA:', error.message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.navigate('FirstScreen');
  };

  const filteredVeterinaries = veterinaries.filter(vet =>
    vet.veterinaryName.toLowerCase().includes(search.toLowerCase())
  );

  const goToProfileScreen = () => {
    navigation.navigate('Profile');
  };

  const goToModVeterinary = () => {
    navigation.navigate('ModVeterinary');
  };

  const goToVeterinarysScreen = () => {
    navigation.navigate('VeterinarysScreen');
  };

  const goToTopVetScreen = () => {
    navigation.navigate('TopVet');
  };
  const goToLoginScreen = () => {
    navigation.navigate('Login');
  };
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateToDestination = () => {
    if (selectedDestination) {
      Alert.alert(`Destino seleccionado: ${selectedDestination.veterinaryName}`);
    } else {
      Alert.alert('Error', 'Por favor selecciona un destino');
    }
  };

  const handleMarkerPress = (veterinary) => {
    setSelectedDestination(veterinary);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Veterinaria"
          placeholderTextColor="#000000"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <MapComponent
        location={simulatedLocation} // Usar la ubicación simulada
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        veterinaries={filteredVeterinaries}
        onMarkerPress={handleMarkerPress}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={toggleMenu}>
          <View style={styles.menu}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={goToProfileScreen}>
                <Text style={styles.menuItem}>Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToVeterinarysScreen}>
                <Text style={styles.menuItem}>Veterinarias</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToTopVetScreen}>
                <Text style={styles.menuItem}>Top5</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggle2FA}>
                <Text style={styles.menuItem}>{is2FAEnabled ? 'Desactivar' : 'Activar'} 2FA</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToLoginScreen} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modeVeterinariaButton} onPress={goToModVeterinary}>
              <Text style={styles.modeVeterinariaText}>Modo Veterinaria</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity style={styles.navigateButton} onPress={navigateToDestination}>
        <Text style={styles.navigateButtonText}>Navegar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#573321',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    color: '#F1D47B',
  },
  menuButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#F1D47B',
    borderRadius: 10,
    marginLeft: -5,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#000',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1D47B',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#F1D47B',
    padding: 20,
    width: '50%',
    maxHeight: '100%',
    height: '91%',
    alignItems: 'flex-end',
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#573321',
    color: 'black',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#573321',
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  modeVeterinariaButton: {
    backgroundColor: '#573321',
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
    marginLeft: -10,
  },
  modeVeterinariaText: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
  navigateButton: {
    backgroundColor: '#F1D47B',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  navigateButtonText: {
    fontSize: 16,
    color: '#573321',
  },
});

export default FirstScreen;
