import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from "react-native";
import {useFonts} from 'expo-font';
import { useState } from "react";
import { db } from "./firebase";
import {ref, set} from 'firebase/database'
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
const Signin= ()=>{
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [fullname, setFullname] = useState('');

    const navigation = useNavigation();

    const handlePass = (text)=> {
        setPassword(text);
    }
    const handlePhone = (text)=> {
        setPhone(text);
    }
    const handleName = (text)=> {
        setFullname(text);
    }
    const [isFontLoaded] = useFonts({
        'one': require('./assets/fonts/one.ttf'),
      });
      if (!isFontLoaded) {
        // Font is still loading
        return null;
      }


      const setData =()=> {

        if(phone.length<10 || phone.length>10){
            ToastAndroid.show("Invalid Number" ,ToastAndroid.SHORT);
        }
        else if(password.length<6){
            ToastAndroid.show("Weak Password" ,ToastAndroid.SHORT);
        }else{
            const userRef = ref(db, 'users/' + phone);

            const userData = {
            phone: phone,
            password: password,
            fullname: fullname
            // Add other properties as needed
            };
    
            set(userRef, userData)
            .then(() => {
                console.log('Data set successfully');
                ToastAndroid.show("Welcome to jugaari world", ToastAndroid.SHORT);
                navigation.navigate("home");
                saveAuthenticationStatus();

            })
            .catch((error) => {
                console.error('Error setting data:', error.message);
            });
        }
      }
      const saveAuthenticationStatus = async () => {
        try {
          await AsyncStorage.setItem('status', 'true');
          await AsyncStorage.setItem('phoneNumber', phone);
          await AsyncStorage.setItem('userName', fullname);
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
                <Text style={{ fontSize: 20, color: '#ffffff',marginTop: 0, alignSelf: 'center', fontFamily: 'main'}}>
                    The game of dis-honesty
                </Text>
                <ImageBackground
                    source={require('./art/box.png')}
                    style={{width: 250, height: 250,alignSelf: 'center',}}
                >
                <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 25}}>
                    Sign Up
                </Text>
                <TextInput
                    style={{width: 200, height: 40, borderColor: '#053120', borderWidth: 1, alignSelf:"center", fontFamily: 'one', fontSize: 20, paddingHorizontal: 10, color: 'white'}}
                    placeholder="Full name"
                    placeholderTextColor={"#5C7C6F"}
                    onChangeText={handleName}
                    value={fullname}
                />
                <TextInput
                    style={{width: 200, height: 40, borderColor: '#053120', borderWidth: 1, alignSelf:"center", fontFamily: 'one', fontSize: 20, paddingHorizontal: 10, color: 'white', marginTop: 10}}
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

                <TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#5C7C6F', padding: 10, paddingHorizontal: 30, borderRadius: 5, marginTop: 10}} onPress={setData}>
                    <Text style={{color: 'white', fontFamily: 'one'}}>
                        Sign Up 
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
export default Signin;