import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {
  const navigation = useNavigation();
  const [sound, setSound] = useState();

  const playBackgroundMusic = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./art/bgmain.mp3'));
      await soundObject.setIsLoopingAsync(true);
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to load background music', error);
    }
  };



  
  /* useEffect(() => {
    playBackgroundMusic();
    return () => {
      // Clean up the audio object when the component unmounts
      soundObject.unloadAsync();
    };
  }, []); */ // empty dependency array to ensure it runs only once
  

  const [isFontLoaded] = useFonts({
    'one': require('./assets/fonts/one.ttf'),
    'two': require('./assets/fonts/two.ttf'),
  });

  useEffect(() => {
    // Additional side effects or cleanup can be added here
    return () => {
      // Clean up the sound when the component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (!isFontLoaded) {
    // Font is still loading
    return null;
  }
  const removeAuthenticationStatus = async () => {
    try {
      await AsyncStorage.removeItem('phoneNumber');
      await AsyncStorage.removeItem('userName');
      console.log('removed');
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error removing authentication status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./art/bgMain.png')}
        style={{ width: '100%', height: '100%' }}
      >
        <Image
          source={require('./art/dbTxt.png')}
          style={{ width: 160, height: 30, alignSelf: 'center', marginTop: 15 }}
        />
        <Text style={{ fontSize: 20, color: '#ffffff', marginTop: 0, alignSelf: 'center', fontFamily: 'two' }}>
          The game of dis-honesty
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, paddingHorizontal: 40 }}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} onPress={()=> navigation.navigate('create')}>
            <Image
              source={require('./art/create.png')}
              style={{ width: 180, height: 180 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} onPress={() => navigation.navigate('join')}>
            <Image
              source={require('./art/join.png')}
              style={{ width: 180, height: 180 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' }} onPress={removeAuthenticationStatus}>
            <Image
              source={require('./art/settings.png')}
              style={{ width: 180, height: 180 }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
