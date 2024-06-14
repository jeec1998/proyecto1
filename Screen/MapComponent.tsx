import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation'; // Importar Geolocation desde @react-native-community/geolocation
import { GOOGLE_MAPS_APIKEY } from '@env';
import Assets from './Assets';

const MapComponent = () => {
  const [location, setLocation] = useState({
    latitude: -1.66355,
    longitude: -78.6546,
  });
  const [destination, setDestination] = useState({
    latitude: -1.657283,
    longitude: -78.677242,
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    startLocationUpdates();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const startLocationUpdates = () => {
    intervalRef.current = setInterval(() => {
      getLocation();
    }, 1000);
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(current);
      },
      (error) => {
        Alert.alert('Error al obtener la ubicación:', error.message);
      },
     /*  {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      } */
    );
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
          onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
        />
        <Marker
          coordinate={destination}
          title="Lugar de destino"
        />
        <MapViewDirections
          origin={location}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="brown"
        />
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
