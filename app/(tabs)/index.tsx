import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import {useRouter} from 'expo-router'

export default function HomeScreen() {
  const router = useRouter();

  const handlePressCreat =() => {
   router.push('/Creat');

};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.creatbutton]}  testID="creatbutton" onPress={handlePressCreat}>
        <Text style={styles.buttonText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#114B5F', // ou une autre couleur si tu veux
  },
   button: {
    backgroundColor: '#7EE4EC',
    width: 100,            // largeur fixe en pixels
    height: 50,            // hauteur fixe en pixels
    justifyContent: 'center', 
    alignItems: 'center',  
    borderRadius: 50, 
 
  },
  buttonText: {
    color: '#00000',
    fontSize: 15,
    fontWeight: '600',
  },
   creatbutton: {
    position: 'absolute',   // active le positionnement absolu
    top: 100,             // décale le bouton à 20px du bas
    right: 20,   
  },



});
6