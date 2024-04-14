import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { db } from "./firebase";
import {ref, onValue, orderByChild, equalTo, get, set, remove, update} from 'firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react';

const CustomDialog = ({ visible, onClose,}) => {

    const navigation = useNavigation();
    const [id, gotId] = useState();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const storedId = await AsyncStorage.getItem('roomId');
            gotId(storedId);
           

            
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
        
      }, [id]); 

    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


    const goTable = (item) => {
      update(ref(db, 'rooms/' + id), {
        TIA: item
      })
        .then(() => {
          
          if (onClose) {
            onClose();
          }
        })
        .catch((error) => {
          console.error('Error updating TIA:', error);
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={()=> goTable(item)}>
          <Text style={styles.cardText}>{item}</Text>
        </TouchableOpacity>
      );

    const [isFontLoaded] = useFonts({
        'one': require('./assets/fonts/one.ttf'),
        'two': require('./assets/fonts/two.ttf'),
      });
      if (!isFontLoaded) {
        // Font is still loading
        return null;
      }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      

    >
        
      <View style={styles.modalContainer} onPress={onClose} >
        <StatusBar  hidden/>
        <View style={styles.dialogContainer}>
        <StatusBar  hidden/>
          <Text style={styles.dialogTitle}>Throw it as: </Text>
          <FlatList style={{width: 400}}
                data={cards}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>
                    Close
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: 300,
    padding: 20,
    
    borderRadius: 10,
    alignItems: 'center',
  },
  dialogTitle: {
    fontFamily: 'one',
    color: 'white',
    fontSize: 30,
    marginBottom: 10,
  },
  dialogContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 25,
    padding: 10,
    backgroundColor: '#323232',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'green',
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },
  cardText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'one'
  },
});

export default CustomDialog;
