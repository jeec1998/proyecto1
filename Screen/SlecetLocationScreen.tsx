import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '@env';

const SelectLocationScreen = ({ route }) => {
  const { setCoordinates } = route.params;
  const [marker, setMarker] = useState(null);
  const navigation = useNavigation();
  const [region, setRegion] = useState({
    latitude: -1.663076,
    longitude: -78.658784,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const handleConfirm = () => {
    if (marker) {
      setCoordinates(marker);
      navigation.goBack();
    }
  };

  const handleLocationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setMarker({ latitude: lat, longitude: lng });
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Buscar dirección"
        fetchDetails={true}
        onPress={handleLocationSelect}
        query={{
          key: `${GOOGLE_MAPS_APIKEY}`,
          language: 'es',
        }}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
          listView: styles.listView,
          description: styles.description,
        }}
      />
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        region={region}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#573321',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    top: 10,
    
    alignSelf: 'center',
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000', // Color de texto negro
  },
  listView: {
    backgroundColor: '#F1D47B',
  },
  description: {
    color: '#000', // Color de texto negro en las sugerencias
  },
});

export default SelectLocationScreen;
