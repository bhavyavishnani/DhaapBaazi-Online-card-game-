import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ToastAndroid, FlatList } from "react-native";
import {useFonts} from 'expo-font';
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {ref, onValue, orderByChild, equalTo, get, set, remove, update} from 'firebase/database'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'

const Create= ()=>{
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [id, setId] = useState('');
    const [myNameGot, setMyNameGot] = useState('');
    const [players, setPlayers] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const storedNumber = await AsyncStorage.getItem('phoneNumber');
            const storedName = await AsyncStorage.getItem('userName');
            setId(storedNumber);
            setMyNameGot(setMyNameGot);
            set(ref(db,'rooms/'+storedNumber),{
                roomId: storedNumber,
                playersIn: 1,
                roomName: storedName+"'s room",
                TIA: '',
                
            }).then(()=>{
                set(ref(db,'rooms/'+storedNumber+'/'+'game/'+storedNumber),{
                    playerName: storedName,
                    
                })
            })
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      }, []); 

      const LeaveRoom =()=> {
        remove(ref(db, 'rooms/'+ id));
        navigation.goBack();
      }

      useEffect(() => {
        const roomRef = ref(db, 'rooms/'+id+'/'+'game'); // Replace with your room ID
        const unsubscribe = onValue(roomRef, (snapshot) => {
          const roomData = snapshot.val();
          if (roomData) {
            const playerNames = Object.values(roomData).map((player) => player.playerName);
            if(playerNames===undefined){
              //pass
            }
            else{
              setPlayers(playerNames);
            }
          }
        });
    
        return () => {
          // Cleanup the listener when the component unmounts
          unsubscribe();
        };
      }, [id]);

    const startGame = () => {
      if(players.length<=1){
        ToastAndroid.show("Need Atleast 2 players to start the game", ToastAndroid.SHORT);
      }
      else{
        update(ref(db,'rooms/'+id),{
          state: 'Y',
        }).then(async()=>{
          await AsyncStorage.setItem("roomId", id);
        })

        navigation.navigate('table');
        ToastAndroid.show("Creating table for Dhaap Baazi", ToastAndroid.SHORT);
      }
    }
      

    const [isFontLoaded] = useFonts({
        'one': require('./assets/fonts/one.ttf'),
        'two': require('./assets/fonts/two.ttf'),
      });
      if (!isFontLoaded) {
        // Font is still loading
        return null;
      }
      const renderItem = ({ item, index }) => {
        
        if(item===undefined){
            //
        }else{
            return(
                <View style={styles.item}>
                  <Text style={{fontFamily: 'one', fontSize: 15, color: 'white'}}>{index+1}.  {item}</Text>
                </View>
              );
        }
        
      }

    return(
        <View style={styles.container}>
            <ImageBackground source={require('./art/bgMain.png')}
                style={{width: '100%', height: '100%',}}>
                <Image
                source={require('./art/dbTxt.png')}
                style={{width: 160, height: 30, alignSelf: 'center', marginTop: 15}}
                />
                <Text style={{ fontSize: 20, color: '#ffffff',marginTop: 0, alignSelf: 'center', fontFamily: 'two'}}>
                    The game of dis-honesty
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity style={{marginTop: 190}} onPress={LeaveRoom}>
                        <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20}}>
                            Leave room
                        </Text>
                    </TouchableOpacity>
                <ImageBackground
                    source={require('./art/box.png')}
                    style={{width: 250, height: 250,alignSelf: 'center',}}
                >
                <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 25}}>
                    Create room
                </Text>
                <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 25, borderColor: '#053120', borderWidth: 1, paddingHorizontal: 30}}>
                    ID:  {id}
                </Text>
                <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20}}>
                    Joined players
                </Text>
                <FlatList
                style={{marginBottom: 10}}
                data={players}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false} // Remove vertical scroll bar
                overScrollMode={'never'} 
                />
                
                <Text style={{color: 'white', alignSelf: 'flex-end',paddingHorizontal: 10, fontFamily: 'one', fontSize: 15, marginTop: 210, position: 'absolute'}}>
                    Max: 4
                </Text>
                
                </ImageBackground>
                <TouchableOpacity style={{marginTop: 190}}>
                        <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20}} onPress={startGame}>
                            Start game
                        </Text>
                    </TouchableOpacity>
                </View>
            
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
    item: {
        marginLeft: 10,
      },
  });
export default Create;