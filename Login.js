import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ToastAndroid } from "react-native";
import {useFonts} from 'expo-font';
import { useState } from "react";
import { db } from "./firebase";
import {ref, onValue, orderByChild, equalTo, get} from 'firebase/database'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login= ()=>{
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const navigation = useNavigation();

    const handlePass = (text)=> {
        setPassword(text);
    }
    const handlePhone = (text)=> {
        setPhone(text);
    }
    const [isFontLoaded] = useFonts({
        'one': require('./assets/fonts/one.ttf'),
        'two': require('./assets/fonts/two.ttf'),
      });
      if (!isFontLoaded) {
        // Font is still loading
        return null;
      }

      const checkNumber=()=>{
        const favoritesRef = ref(db, 'users/');
        const unsubscribe = onValue(favoritesRef, (snapshot) => {
            const favoritesData = snapshot.val();
            
            if (favoritesData && favoritesData[phone]){
                const checkPass = ref(db, 'users/'+phone+'/password');
                const unPass = onValue(checkPass, (snapshot)=>{
                    const userPass = snapshot.val();
                    if(userPass==password){
                        ToastAndroid.show("Welcome to jugaari world", ToastAndroid.SHORT);
                        navigation.navigate('home');
                        saveAuthenticationStatus();

                    }
                    else{
                        ToastAndroid.show("Wrong password", ToastAndroid.SHORT);
                    }
                })
            }
            else{
                ToastAndroid.show("No Account Exists", ToastAndroid.SHORT);
            }
            return()=>{
                unsubscribe();
            }
        });
    }
    const saveAuthenticationStatus = async () => {
        try {
          await AsyncStorage.setItem('status', 'true');
          await AsyncStorage.setItem('phoneNumber', phone);
          console.log('done');
        } catch (error) {
          console.error('Error saving authentication status:', error);
        }
      };
    

    return(
        <View style={styles.container}>
            <ImageBackground source={require('./art/bgMain.png')}
                style={{width: '100%', height: '100%'}}>
                <Image
                source={require('./art/dbTxt.png')}
                style={{width: 160, height: 30, alignSelf: 'center', marginTop: 15}}
                />
                <Text style={{ fontSize: 20, color: '#ffffff',marginTop: 0, alignSelf: 'center', fontFamily: 'two'}}>
                    The game of dis-honesty
                </Text>
                <ImageBackground
                    source={require('./art/box.png')}
                    style={{width: 250, height: 250,alignSelf: 'center',}}
                >
                <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 25}}>
                    Login
                </Text>
                <TextInput
                    style={{width: 200, height: 40, borderColor: '#053120', borderWidth: 1, alignSelf:"center", fontFamily: 'one', fontSize: 20, paddingHorizontal: 10, color: 'white'}}
                    placeholder="Phone number"
                    placeholderTextColor={"#5C7C6F"}
                    onChangeText={handlePhone}
                    value={phone}
                    keyboardType="numeric"
                />
                <TextInput
                    style={{width: 200, height: 40, borderColor: '#053120', borderWidth: 1, alignSelf:"center", fontFamily: 'one', fontSize: 20, paddingHorizontal: 10, color: 'white', marginTop: 10}}
                    placeholder="Password"
                    textContentType="password"
                    inputMode="text"
                    secureTextEntry={true}
                    placeholderTextColor={"#5C7C6F"}
                    onChangeText={handlePass}
                    value={password}
                />

                <TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#5C7C6F', padding: 10, paddingHorizontal: 30, borderRadius: 5, marginTop: 10}} onPress={checkNumber}>
                    <Text style={{color: 'white', fontFamily: 'one'}}>
                        Login 
                    </Text>
                </TouchableOpacity>
                </ImageBackground>
            
            </ImageBackground>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
export default Login;