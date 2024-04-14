import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ToastAndroid } from "react-native";
import {useFonts} from 'expo-font';
import { useState } from "react";
import { db } from "./firebase";
import {ref, onValue, orderByChild, equalTo, get, set, remove, update} from 'firebase/database'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from "react";

const Join= ()=>{
    const [phone, setPhone] = useState('');
    const [myId, setMyId] = useState('');
    const [myNameGot, setMyNameGot] = useState('');
    const [joinSt, setJoinSt] = useState(false)
    const [romName, setRoomName] = useState('');
    

    const navigation = useNavigation();
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
      useEffect(() => {
        const fetchData = async () => {
          try {
            const storedStatus = await AsyncStorage.getItem('phoneNumber');
            const storedName = await AsyncStorage.getItem('userName');
            setMyId(storedStatus);
            setMyNameGot(storedName);
            
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      }, []); 

      const LeaveRoom =()=> {
        remove(ref(db, 'rooms/'+ phone+'/'+'game/'+myId));
        navigation.goBack();
      }


      
        const fetchName = () => {
          const favoritesRef = ref(db, 'users/' + myId);
          
          // Set up the listener
          const unsubscribe = onValue(favoritesRef, (snapshot) => {
            const getInfo = snapshot.val();
            setMyNameGot(getInfo?.fullname || ''); // Check for null or undefined
          });
    
          // Clean up the listener when the component unmounts
          return () => {
            unsubscribe();
          };
        };
    
        // Invoke the fetchData function
      

      

      const joinRoom = async () => {
        try {
          const roomsRef = ref(db, 'rooms/');
          const roomsSnapshot = await get(roomsRef);
      
          if (roomsSnapshot.exists()) {
            const roomData = roomsSnapshot.val();
            
            if (roomData[phone]) {
              const checkPassRef = ref(db, `rooms/${phone}/playersIn`);
              const checkPassSnapshot = await get(checkPassRef);
      
              const userPass = checkPassSnapshot.val();
              
      
              if (userPass === 6) {
                ToastAndroid.show("Room is full", ToastAndroid.SHORT);
              } else {
                const userRoomRef = ref(db, `rooms/${phone}/${'game'}/${myId}`);
                fetchName();
                await set(userRoomRef, {
                  playerName: myNameGot,
                  
                }).then(()=>{
                    update(ref(db, 'rooms/'+phone),{
                        playersIn: userPass+1,
                    }).then(async()=>{
                      const roomName = ref(db, `rooms/${phone}/roomName`);
                      const checkName = await get(roomName);
                      const name = checkName.val();
                      setRoomName(name);
                    })
                })
                // Add your navigation logic here if needed
                setJoinSt(true);
                ToastAndroid.show("Joined room successfully", ToastAndroid.SHORT);
              }
            } else {

              ToastAndroid.show("No room exists", ToastAndroid.SHORT);
            }
          }
        } catch (error) {
          console.error('Error joining room:', error);
        }
      };

      useEffect(() => {
        const checkRoomName = async () => {
          const roomNameRef = ref(db, `rooms/${phone}/state`);
    
          // Use onValue to listen for changes in the database
          onValue(roomNameRef, (snapshot) => {
            const name = snapshot.val();
    
            if (name === 'Y') {
              const storeId = async()=>{
                await AsyncStorage.setItem("roomId", phone);
              }
              storeId();
              navigation.navigate('table');
            }
          });
        };
    
        checkRoomName();
      }, [phone, navigation]);
      

      
    

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
                <TouchableOpacity style={{marginTop: 270, position: 'absolute', marginLeft: 80,}} onPress={LeaveRoom}>
                        <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20,}}>
                            Leave room
                        </Text>
                    </TouchableOpacity>
                <ImageBackground
                    source={require('./art/box.png')}
                    style={{width: 250, height: 250,alignSelf: 'center',}}
                >
                <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 25}}>
                    Join room
                </Text>
                <TextInput
                    style={{width: 200, height: 40, borderColor: '#053120', borderWidth: 1, alignSelf:"center", fontFamily: 'one', fontSize: 20, paddingHorizontal: 10, color: 'white'}}
                    placeholder="Enter player id"
                    placeholderTextColor={"#5C7C6F"}
                    onChangeText={handlePhone}
                    value={phone}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#5C7C6F', padding: 10, paddingHorizontal: 30, borderRadius: 5, marginTop: 10}} onPress={joinRoom} disabled={joinSt}>
                    <Text style={{color: 'white', fontFamily: 'one'}}>
                        Join
                    </Text>
                </TouchableOpacity>
                {romName=='' ? <Text></Text> : <Text style={{color: 'white', fontFamily: 'one', alignSelf:"center", marginTop: 20}}>
                  Joined {romName}{console.log(romName)}
                </Text>}
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
export default Join;