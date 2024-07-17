import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { PermissionsAndroid, Platform } from 'react-native';
import HomeScreen from './HomeScreen';
import FirstScreen from './FirstScreen';
import ProfileScreen from './ProfileScreen';
import ModVeterinary from './ModoVeterinaria';
import VeterinarysScreen from './VeterinarysScreen';
import FavScreen from './FavScreen';
import SelectLocationScreen from './SlecetLocationScreen';
import VeterinaryDetailScreen from './VetarinaryDetailsScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import VeterinaryRequestsScreen from './Admin/VeterinaryRequestsScreen';
import NormalVeterinaryListScreen from './Admin/NormalVeterinaryListScreen';
import AdminDashboardScreen from './Admin/AdminDashboardScreen';
import TopVetScreen from './TopVetScreen';
import MapComponent from './MapComponent';


const Stack = createStackNavigator();

function App() {
  return (
  
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MapComponent" component={MapComponent} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="First" component={FirstScreen}/>
          <Stack.Screen name='Profile' component={ProfileScreen}/>
          <Stack.Screen name='ModVeterinary' component={ModVeterinary}/>
          <Stack.Screen name='VeterinarysScreen' component={VeterinarysScreen}/>
          <Stack.Screen name='FavScreen' component={FavScreen} />
          <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
          <Stack.Screen name="VeterinaryDetailScreen" component={VeterinaryDetailScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="VeterinaryRequestsScreen" component={VeterinaryRequestsScreen} />
        <Stack.Screen name="NormalVeterinaryListScreen" component={NormalVeterinaryListScreen} />
        <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} />
        <Stack.Screen name="TopVet" component={TopVetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  
  );
}

export default App;
