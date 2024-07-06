import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '@env';
import axios from 'axios';

const MapComponent = ({ location, selectedDestination, setSelectedDestination }) => {
  const [veterinaries, setVeterinaries] = useState([]);

  useEffect(() => {
    fetchVeterinaries();
  }, []);

  const fetchVeterinaries = async () => {
    try {
      const response = await axios.get('https://tu-api-url/veterinaries');
      setVeterinaries(response.data);
    } catch (error) {
      Alert.alert('Error al cargar las ubicaciones de las veterinarias:', error.message);
    }
  };

  const handleMarkerPress = (coordinate) => {
    setSelectedDestination(coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0221,
        }}
      >
        <Marker
          coordinate={location}
          title="Tú estás aquí"
        />
        {veterinaries.map((veterinary, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: veterinary.latitude,
              longitude: veterinary.longitude,
            }}
            title={veterinary.name}
            onPress={() => handleMarkerPress({
              latitude: veterinary.latitude,
              longitude: veterinary.longitude,
            })}
          />
        ))}
        {selectedDestination && (
          <MapViewDirections
            origin={location}
            destination={selectedDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="brown"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapComponent;
