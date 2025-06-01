import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CreatScreen() {
  return (
    <View style={styles.container}>
     <View style={styles.box}>
        <Text style={styles.boxText}>New Note</Text>

       
         {/* Champ pour le titre */}
        
          <TextInput style={[styles.input, styles.titleInput, ]}  placeholder="Title" placeholderTextColor="#ffff"    />

         {/* Champ pour le texte (multiligne) */}

          <TextInput style={[styles.input, styles.bodyInput, styles.multiline]}   placeholder="Texte" placeholderTextColor="#ffff"   multiline />
         <TouchableOpacity style={[styles.button, styles.creatbutton]}  testID="creatbutton" >
                  <Text style={styles.buttonText}>+ Creat note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#114B5F',
  },
    box: {
    width: 400,              
    height: 700,             
    backgroundColor: '#7EE4EC',
    borderWidth: 2,           
    borderColor: '#114B5F',    
    borderRadius: 8,          
    padding: 12,              
    justifyContent: 'center',  
    alignItems: 'center',      
    shadowColor: '#000',      
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,           
  },
  boxText: {
     position: 'absolute',  
    top: 80,      
    fontSize: 50,
    color: '#114B5F',
    fontWeight: '600',
  },

   button: {
    backgroundColor: '#114B5F',
    width: 100,         
    height: 50,           
    justifyContent: 'center', 
    alignItems: 'center',  
    borderRadius: 50, 
 
  },
  buttonText: {
    color: '#ffff',
    fontSize: 15,
    fontWeight: '600',
  },
   creatbutton: {
    position: 'absolute',   
    bottom: 20,           
      
  },
    input: {
    borderWidth: 1,
    borderColor: '#ffff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#ffff',
    marginBottom: 16,
  },
  multiline: {
    height: 120, 
    textAlignVertical: 'top', 
  },
   titleInput: {
    width: '100%',   
    height: 40,
     backgroundColor: '#114B5F',
      
  },
  bodyInput: {
    width: '100%',   
    height: 150,   
    textAlignVertical: 'top', 
    backgroundColor: '#114B5F',
  },
});