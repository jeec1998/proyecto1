import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import MapComponent from './MapComponent';
import { useNavigation } from '@react-navigation/native'; 
const FirstScreen = () => {
    const [search, setSearch] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation(); 
    const goToProfileScreen = () => {
        navigation.navigate('Profile');
      };
      const goToModVeterinary = () => {
        navigation.navigate('ModVeterinary');
      };
  /*     const goToFavoriteVets = () => {
        navigation.navigate('FavoriteVets');
      };
      const goToVets = () => {
        navigation.navigate('Vets');
      }; */
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
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

            <MapComponent />

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
                            <TouchableOpacity onPress={toggleMenu}>
                                <Text style={styles.menuItem}>Veterinarias</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleMenu}>
                                <Text style={styles.menuItem}>Favoritas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleMenu}>
                                <Text style={styles.menuItem}>Top 5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleMenu}>
                                <Text style={styles.menuItem}>VET-IA</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.modeVeterinariaButton} onPress={goToModVeterinary}>
                            <Text style={styles.modeVeterinariaText}>Modo Veterinaria</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
});

export default FirstScreen;
