import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Assets from './Assets'; // Ajusta la ruta según tu estructura de proyecto
import { GOOGLE_MAPS_APIKEY } from '@env';

const MapComponent = ({ location, selectedDestination, setSelectedDestination, veterinaries, onMarkerPress }) => {
  const handleMarkerPress = (veterinary) => {
    setSelectedDestination(veterinary);
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
            icon={Assets.patitaback} // Ajusta esta ruta según tu estructura de proyecto
            onPress={() => handleMarkerPress(veterinary)}
          >
            <Callout onPress={() => handleMarkerPress(veterinary)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{veterinary.veterinaryName}</Text>
              </View>
            </Callout>
          </Marker>
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
  calloutContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 150,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default MapComponent;
