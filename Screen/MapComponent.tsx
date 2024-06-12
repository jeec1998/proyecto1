import React, { useEffect, useState } from 'react';
import Location from 'expo-location';
import {Alert, StyleSheet, View,  } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
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
   /*  useEffect(()=>{
        getLocationPermission();
    })
  async function getLocationPermission(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
        Alert.alert('Permiso denegado');
        return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    }
    setLocation(current);
  } */


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
                    draggable
                    coordinate={location}
                    
                    title="Tú estás aquí"
                    onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)} // Modificar la dirección 
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
