import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ToastAndroid, FlatList, ScrollView, StatusBar, Animated, Vibration } from "react-native";
import {useFonts} from 'expo-font';
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {ref, onValue, orderByChild, equalTo, get, set, remove, update, query} from 'firebase/database'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native';
import { useRef } from "react";
import { Audio } from 'expo-av';
import CustomDialog from "./CustomDialog";

const Table = () => {
    const [players, setPlayers] = useState([]);
    const [myNameGot, setMyNameGot] = useState('');
    const [id, gotId] = useState('');
    const [myId, setmyId] = useState('');
    const [btn, setBtn] = useState(false);
    const [cards, setCards] = useState([]);
    const [gotCards, setGotCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [pressedCards, setPressedCards] = useState([]);
    const [mainBtns, setMainBtns] = useState(true);
    const [showCards, setShowCards] = useState(new Array(gotCards.length).fill(false));
    const [cOt, setcOt] = useState('');
    const [tIa, settIa]= useState('');
    const [playerIds, setPlayerIds] = useState([]);
    const Tcards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const [timer, setTimer] = useState(45);
    const [pickedCard, setPickedCard] = useState([]);
    const [lastPlayer, setLastPlayer] = useState('');
    const[cardPicked, setPicked] = useState(false);
    const[memeBtn, setMemeBtn] = useState(false);
    const[gotAudio, setGotAudio] = useState('');
    const [winners, setWinners] = useState([]);
    const [looser, setLooser] = useState('');
    const [lead, showLead] = useState(false);
    const [one, setOne] = useState(true);
    const [playerChance, setPlayerChance] = useState('');

    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    

    const [tableCard, setTableCard] = useState([]); 

    
      const [isDialogVisible, setDialogVisible] = useState(false);
      

    const openDialog = () => {
      setDialogVisible(true);
    };

    const closeDialog = () => {
      setDialogVisible(false);
    };

    const chancePass = () => {
      if(lastPlayer===myId){
        remove(ref(db,'rooms/'+id+'/showCards'));
        remove(ref(db,'rooms/'+id+'/TableCards'));
        remove(ref(db,'rooms/'+id+'/COT'));
        remove(ref(db,'rooms/'+id+'/TIA'));
      }
      else{
        const curCh = playerIds.indexOf(myId);
        if(playerIds[curCh+1]===undefined){
          update(ref(db, 'rooms/'+id), {
            Chance: playerIds[0]
          })
        }else{
          update(ref(db, 'rooms/'+id), {
            Chance: playerIds[curCh+1]
          })
        }
      }
    }


    useEffect(() => {
      if(cardPicked){
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 500, // Duration in milliseconds
          useNativeDriver: true, // Add this line for better performance
        }
      ).start();

      }
    }, [fadeAnim, cardPicked]);


    //check winners 

    useEffect(()=>{
      if(playerIds.length-winners.length === 1){
        if(cards.length!==0){
        set(ref(db,"rooms/"+id+"/looser"),{
          looser: myNameGot,
        });
      }
      }
    }, [winners, playerIds]);

    //check Audio

    useEffect(() => {
      const roomRef = ref(db, `rooms/${id}/audio/audioNum`);
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const cardData = snapshot.val();
        if (cardData) {
          setGotAudio(cardData);
          
        }
        else{
          setGotAudio('');
        }
      });
  
      return () => {
        // Cleanup the listener when the component unmounts
        unsubscribe();
      };
      
    }, [id, gotAudio]);

    useEffect(() => {
      const playAudio = async () => {
        try {
          let audioFile;
          if (gotAudio === 1) {
            audioFile = require('./art/audio/asambhav.mp3');
            remove(ref(db, "rooms/"+id+"/audio"));
          } else if (gotAudio === 2) {
            audioFile = require('./art/audio/YKH.mp3');
            remove(ref(db, "rooms/"+id+"/audio"));
          } else if (gotAudio === 3) {
            audioFile = require('./art/audio/bc.mp3');
            remove(ref(db, "rooms/"+id+"/audio"));
          } else if (gotAudio === 4) {
            audioFile = require('./art/audio/randi.mp3');
            remove(ref(db, "rooms/"+id+"/audio"));
          } else if (gotAudio === 5) {
            audioFile = require('./art/audio/BSDK.mp3');
            remove(ref(db, "rooms/"+id+"/audio"));
          } else if (gotAudio === 6) {
            audioFile = require('./art/audio/BKL.mp3');
            remove(ref(db, "rooms/"+id+"/audio"));
          } else {
            return; // Do nothing for other numbers
          }
          
          if(audioFile!==null){
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync(audioFile);
            await soundObject.playAsync()
          }
        } catch (error) {
          console.log('Error playing sound:', error);
        }
      };
  
      // Call the playAudio function with the desired number
      playAudio(1);
    }, [gotAudio]);

    // check Chance
    useEffect(() => {
      const roomRef = ref(db, `rooms/${id}/Chance`);
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const cardData = snapshot.val();
        if (cardData) {
          if(cardData===myId){

            if(cards.length===0){
              console.log("skipped");
              update(ref(db, "rooms/"+id+"/winners/"+myId), {
                winnerName: myNameGot,
              });
              const curCh = playerIds.indexOf(myId);
              if(playerIds[curCh+1]===undefined){
                update(ref(db, 'rooms/'+id), {
                  Chance: playerIds[0]
                })
              }else{
                update(ref(db, 'rooms/'+id), {
                  Chance: playerIds[curCh+1]
                })
              }
            }
            else{
              update(ref(db, "rooms/"+id), {
                pChance: myNameGot,
              });
              setMainBtns(false);
              Vibration.vibrate(100);

            }
            
            
            
          }
          else{
            setMainBtns(true);
            setTimer(45);
          }
        }
      });
  
      return () => {
        // Cleanup the listener when the component unmounts
        unsubscribe();
      };
    }, [id, cards]);

    // player chance
    useEffect(() => {
      const roomRef = ref(db, `rooms/${id}/pChance`);
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const cardData = snapshot.val();
        if (cardData) {
          setPlayerChance(cardData);
        }
        else{
          setPlayerChance('');
        }
      });
  
      return () => {
        // Cleanup the listener when the component unmounts
        unsubscribe();
      };
      
    }, [id, playerChance]);

      //tableCards

      useEffect(() => {
        const roomRef = ref(db, `rooms/${id}/LastThrown`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
          const cardData = snapshot.val();
          if (cardData) {
            setLastPlayer(cardData);
          }
          else{
            setLastPlayer('');
          }
        });
    
        return () => {
          // Cleanup the listener when the component unmounts
          unsubscribe();
        };
        
      }, [id, lastPlayer]);


      //get looser 

      useEffect(() => {
        const roomRef = ref(db, `rooms/${id}/looser`);
        if(looser===''){
          const unsubscribe = onValue(roomRef, (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
              console.log("loser: "+cardData.looser);
              setLooser(cardData);
              showLead(true);
            }
           
          });
          return () => {
            // Cleanup the listener when the component unmounts
            unsubscribe();
          };
        }
        
      }, [id, looser]);

      useEffect(() => {
        const roomRef = ref(db, `rooms/${id}/pickedCard`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
          const cardData = snapshot.val();
          if (cardData) {
            setPickedCard(cardData);
            setPicked(true);
          }
          else{
            
            setPicked(false);
          }
        });
    
        return () => {
          // Cleanup the listener when the component unmounts
          unsubscribe();
        };
        
      }, [id]);

    useEffect(() => {
      const roomRef = ref(db, `rooms/${id}/TableCards`);
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const cardData = snapshot.val();
        if (cardData) {
          setTableCard(cardData);
        }
        else{
          setTableCard([]);
        }
      });
  
      return () => {
        // Cleanup the listener when the component unmounts
        unsubscribe();
      };
    }, [id]);

    useEffect(() => {
      let timer;
      if (cardPicked) {
        timer = setTimeout(() => {
          const roomRef = ref(db, 'rooms/' + id + '/pickedCard');
          remove(roomRef).then(() => {
            console.log('Card removed from the room after 2 seconds');
          }).catch((error) => {
            console.error('Error removing card:', error);
          });
        }, 2000);
      }
    
      // Cleanup function to clear the timeout when component unmounts or when `cardPicked` changes
      return () => clearTimeout(timer);
    }, [cardPicked, db, id]);

    const goTable = (item) => {

      const updatedTableCards = [...tableCard, ...selectedCards];

      if(tIa===item || tableCard.length===0){

      update(ref(db, 'rooms/' + id), {
        TIA: item,
        COT: selectedCards.length,
        showCards: selectedCards,
        TableCards: updatedTableCards,
        LastThrown: myId,


      }).then(()=>{
        setMainBtns(true);
        setDialogVisible(false);
        setSelectedCards([]);
        setPressedCards([]);
        handleRemoveCards();
      }).then(()=>{
        const curCh = playerIds.indexOf(myId);
        if(playerIds[curCh+1]===undefined){
          update(ref(db, 'rooms/'+id), {
            Chance: playerIds[0]
          })
        }else{
          update(ref(db, 'rooms/'+id), {
            Chance: playerIds[curCh+1]
          })
        }

      })
        .catch((error) => {
          console.error('Error updating TIA:', error);
        });
      }
      else{
        ToastAndroid.show("Please select the right dhaap", ToastAndroid.SHORT);
      }
      

    };

    const Titem = ({ item }) => (
      <TouchableOpacity style={styles.card} onPress={()=> goTable(item)}>
        <Text style={styles.cardText}>{item}</Text>
      </TouchableOpacity>
    );


    //timer

    useEffect(() => {
      const interval = setInterval(() => {
          // Decrease timer value every secon
          
          if(!mainBtns){
            if(timer>0){
              setTimer((prevTimer) => prevTimer - 1);
              
            }
            if(timer<=0){
                  const curCh = playerIds.indexOf(myId);
                  if(playerIds[curCh+1]===undefined){
                    update(ref(db, 'rooms/'+id), {
                      Chance: playerIds[0]
                    })
                  }else{
                    update(ref(db, 'rooms/'+id), {
                      Chance: playerIds[curCh+1]
                    })
                  }
            }
          }
          
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
  }, [timer, mainBtns]);

    useEffect(() => {
      const fetchPlayerIds = async () => {
        try {
          const roomRef = ref(db, 'rooms/'+id+'/game');
          const roomSnapshot = await get(roomRef);
          const playersData = roomSnapshot.val();
          if (playersData) {
            const ids = Object.keys(playersData);
            setPlayerIds(ids);
          } else {
            console.log("No players data found");
          }
        } catch (error) {
          console.error("Error fetching player IDs:", error);
        }
      };
  
      fetchPlayerIds();
    }, [id]);; // Removed playerIds from the dependency array
     // Empty dependency array to run the effect only once, on moun
    

    useEffect(()=>{
      const hasASpades = cards.some(card => card.rank === 'A' && card.suit === 'Spades');
    
            if (hasASpades) {
              setMainBtns(false);
            } else {
              //
            }

    }, [cards])


    const cardImages = {
      Hearts: {
        '2': require('./Cards/Hearts_2.png'),
        '3': require('./Cards/Hearts_3.png'),
        '4': require('./Cards/Hearts_4.png'),
        '5': require('./Cards/Hearts_5.png'),
        '6': require('./Cards/Hearts_6.png'),
        '7': require('./Cards/Hearts_7.png'),
        '8': require('./Cards/Hearts_8.png'),
        '9': require('./Cards/Hearts_9.png'),
        '10': require('./Cards/Hearts_10.png'),
        J: require('./Cards/Hearts_J.png'),
        Q: require('./Cards/Hearts_Q.png'),
        K: require('./Cards/Hearts_K.png'),
        A: require('./Cards/Hearts_A.png'),
      },
      Diamonds: {
        '2': require('./Cards/Diamonds_2.png'),
        '3': require('./Cards/Diamonds_3.png'),
        '4': require('./Cards/Diamonds_4.png'),
        '5': require('./Cards/Diamonds_5.png'),
        '6': require('./Cards/Diamonds_6.png'),
        '7': require('./Cards/Diamonds_7.png'),
        '8': require('./Cards/Diamonds_8.png'),
        '9': require('./Cards/Diamonds_9.png'),
        '10': require('./Cards/Diamonds_10.png'),
        J: require('./Cards/Diamonds_J.png'),
        Q: require('./Cards/Diamonds_Q.png'),
        K: require('./Cards/Diamonds_K.png'),
        A: require('./Cards/Diamonds_A.png'),
      },
      Clubs: {
        '2': require('./Cards/Clubs_2.png'),
        '3': require('./Cards/Clubs_3.png'),
        '4': require('./Cards/Clubs_4.png'),
        '5': require('./Cards/Clubs_5.png'),
        '6': require('./Cards/Clubs_6.png'),
        '7': require('./Cards/Clubs_7.png'),
        '8': require('./Cards/Clubs_8.png'),
        '9': require('./Cards/Clubs_9.png'),
        '10': require('./Cards/Clubs_10.png'),
        J: require('./Cards/Clubs_J.png'),
        Q: require('./Cards/Clubs_Q.png'),
        K: require('./Cards/Clubs_K.png'),
        A: require('./Cards/Clubs_A.png'),
      },
      Spades: {
        '2': require('./Cards/Spades_2.png'),
        '3': require('./Cards/Spades_3.png'),
        '4': require('./Cards/Spades_4.png'),
        '5': require('./Cards/Spades_5.png'),
        '6': require('./Cards/Spades_6.png'),
        '7': require('./Cards/Spades_7.png'),
        '8': require('./Cards/Spades_8.png'),
        '9': require('./Cards/Spades_9.png'),
        '10': require('./Cards/Spades_10.png'),
        J: require('./Cards/Spades_J.png'),
        Q: require('./Cards/Spades_Q.png'),
        K: require('./Cards/Spades_K.png'),
        A: require('./Cards/Spades_A.png'),
      },
    };
  
    


    useEffect(() => {
        const fetchData = async () => {
          try {
            const storedStatus = await AsyncStorage.getItem('phoneNumber');
            const storedName = await AsyncStorage.getItem('userName');
            const storedId = await AsyncStorage.getItem('roomId');
            setmyId(storedStatus);
            setMyNameGot(storedName);
            gotId(storedId);

            if(storedStatus===storedId){
              setBtn(true);
            }
           

            
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
        
      }, [myNameGot, id]); 

      //get winners 

      useEffect(() => {
        const roomRef = ref(db, 'rooms/' + id+'/winners'); // Replace with your room ID
        const unsubscribe = onValue(roomRef, (snapshot) => {
          const roomData = snapshot.val();
          if (roomData) {
            const winnerNames = Object.values(roomData).map((player) => player.winnerName);

      // Update the players state with the filtered array
            setWinners(winnerNames);            
          }
        });
      
        return () => {
          // Cleanup the listener when the component unmounts
          unsubscribe();
          
        };
      }, [myNameGot, id]);

      useEffect(() => {
        const roomRef = ref(db, 'rooms/' + id+'/game'); // Replace with your room ID
        const unsubscribe = onValue(roomRef, (snapshot) => {
          const roomData = snapshot.val();
          if (roomData) {
            const playerNames = Object.values(roomData).map((player) => player.playerName);
            console.log(playerNames);

            const filteredPlayerNames = playerNames.filter(name => name !== myNameGot);

      // Update the players state with the filtered array
            setPlayers(filteredPlayerNames);
            
        
          }
        });
      
        return () => {
          // Cleanup the listener when the component unmounts
          unsubscribe();
          
        };
      }, [myNameGot, id]);

        const shuffleDeck = async () => {
          try {
            const roomRef = ref(db, 'rooms/'+id+'/game');
            const roomSnapshot = await get(roomRef);
      
            if (roomSnapshot.exists()) {
              const roomData = roomSnapshot.val();

      
              if (roomData && typeof roomData === 'object') {
                const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
                const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
                const deck = [];
      
                suits.forEach((suit) => {
                  ranks.forEach((rank) => {
                    deck.push({ suit, rank });
                  });
                });
      
                // Shuffle the deck using the Fisher-Yates algorithm
                for (let i = deck.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [deck[i], deck[j]] = [deck[j], deck[i]];
                }
      
                // Distribute the shuffled deck among players
                const playerIds = Object.keys(roomData);
                const cardsPerPlayer = Math.floor(deck.length / (players.length+1));
      
                playerIds.forEach((playerId, index) => {
                    const startIndex = index * cardsPerPlayer;
                    const endIndex = startIndex + cardsPerPlayer;
                    const playerCards = deck.slice(startIndex, endIndex);
                  
                  
                    // Update the player's cards in the database
                    set(ref(db, 'rooms/' + id + '/game/' + playerId + '/cards'), playerCards).then(()=>{
                      setBtn(false);
                    })
                  });
              } else {
                console.error('Invalid or missing data structure in the room:', roomData);
              }
            } else {
              console.error('Room does not exist:', id);
            }
          } catch (error) {
            console.error('Error shuffling deck:', error);
          }
        };

        //shuffle sound 

        useEffect(()=> {
          if(cards.length>0){
            
            if(one){
            const playAudio = async() => {
              const audioFile = require('./art/audio/shuffle.mp3');
              const soundObject = new Audio.Sound();
              await soundObject.loadAsync(audioFile);
              await soundObject.playAsync()
            }
            playAudio();
            }
            setOne(false);
         }
        }, [cards]);

        //getting cards

        useEffect(() => {
          const roomRef = ref(db, `rooms/${id}/game/${myId}/cards`);
          const unsubscribe = onValue(roomRef, (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
              setCards(cardData);
              
            }
            else{
              setCards([]);
            }
          });
      
          return () => {
            // Cleanup the listener when the component unmounts
            unsubscribe();
          };
        }, [id, myId]);

        

        useEffect(() => {
          const roomRef = ref(db, `rooms/${id}/showCards`);
          const unsubscribe = onValue(roomRef, (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
              setGotCards(cardData);
              const playAudio = async() => {
                const audioFile = require('./art/audio/chance.mp3');
                const soundObject = new Audio.Sound();
                await soundObject.loadAsync(audioFile);
                await soundObject.playAsync()
              }
              playAudio();
            }
            else{
              setGotCards([]);
              setPressedCards([]);
              setShowCards(false);
              const updatedShowCards = Array(gotCards.length).fill(false);
              setShowCards(updatedShowCards);
              settIa('');
              setcOt('')
            }
          });
      
          return () => {
            // Cleanup the listener when the component unmounts
            unsubscribe();
          };
        }, [id]);

        
        useEffect(() => {
          const roomRef = ref(db, `rooms/${id}/COT`);
          const unsubscribe = onValue(roomRef, (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
              setcOt(cardData);
            }
          });
      
          return () => {
            // Cleanup the listener when the component unmounts
            unsubscribe();
          };
        }, [id, myId]);

        useEffect(() => {
          const roomRef = ref(db, `rooms/${id}/TIA`);
          const unsubscribe = onValue(roomRef, (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
              settIa(cardData);
            }
          });
      
          return () => {
            // Cleanup the listener when the component unmounts
            unsubscribe();
          };
        }, [id]);


        //remove cards
        
        const handleRemoveCards = () => {
          // Remove selected cards from all cards

          const updatedCards = cards.filter(card =>
            !selectedCards.some(selectedCard =>
              selectedCard.suit === card.suit && selectedCard.rank === card.rank
            )
          );


          set(ref(db, 'rooms/'+id+'/game/'+myId+'/cards'), updatedCards).then(()=>{
            console.log('updated Cards');
          })
          

          // Update state or send data to Firebase
          // Clear selected cards
        };
        
      


        const handleCardPress = (item) => {

          const isSelected = selectedCards.some(
            (card) => card.suit === item.suit && card.rank === item.rank
          );

          if (pressedCards.includes(item)) {
            // Card is already pressed, so remove it
            setPressedCards((prev) => prev.filter((card) => card !== item));
            setSelectedCards((prevSelectedCards) =>
            prevSelectedCards.filter(
            (card) => !(card.suit === item.suit && card.rank === item.rank)
          )
      );
          } else {
            // Card is not pressed, so add it
            setPressedCards((prev) => [...prev, item]);
            setSelectedCards((prevSelectedCards) => [...prevSelectedCards, { suit: item.suit, rank: item.rank }])
          }
        };
      
        const isCardPressed = (item) => pressedCards.includes(item);

        

      const ThrowCards = () => {
        if(selectedCards.length===0){
          ToastAndroid.show("Please select cards", ToastAndroid.SHORT);
        }
        else{
          if(tIa!==''){
            goTable(tIa);
          }
          else{
            openDialog();
          }
          
        }
      }


      
    useEffect(() => {
      // Custom comparison function for sorting
      function compareCards(a, b) {
          // First, compare ranks
          if (a.rank < b.rank) return -1;
          if (a.rank > b.rank) return 1;
          // If ranks are equal, sort by suit
          if (a.suit < b.suit) return -1;
          if (a.suit > b.suit) return 1;
          return 0;
      }

      // Sort the cards array only if it's not already sorted
      const sortedCards = [...cards].sort(compareCards);
      if (!areArraysEqual(cards, sortedCards)) {
          // Update the state with the sorted cards array
          setCards(sortedCards);
      }
  }, [cards]);

  function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
          
         
      
 

      const showPatte = (index, rank, suit) => {
        setShowCards((prevShowCards) => {
          const newShowCards = [...prevShowCards];
          newShowCards[index] = !newShowCards[index]; 

          set(ref(db,"rooms/"+id+"/pickedCard"), {
            cardRank: rank,
            cardSuit: suit
          });
          
          if(tIa === rank){
            

            const updatedTableCards = [...tableCard, ...cards];
            set(ref(db, 'rooms/'+id+'/game/'+myId+'/cards'), updatedTableCards).then(()=>{
              console.log('haare huye patte Cards');

              remove(ref(db,'rooms/'+id+'/showCards'));
              remove(ref(db,'rooms/'+id+'/TableCards'));
              remove(ref(db,'rooms/'+id+'/COT'));
              remove(ref(db,'rooms/'+id+'/TIA'));

                   


            }).then(()=>{

              
                update(ref(db, 'rooms/'+id), {
                  Chance: lastPlayer,
                });
              
            });
          }
          else{

                  const roomRef = ref(db, `rooms/${id}/game/${lastPlayer}/cards`);
                  get(roomRef)
                    .then((snapshot) => {
                      const playerCards = snapshot.val() || []; // Initialize with an empty array if no cards are found
                      
                
                      // Step 2: Add more cards to the retrieved array (for example, newCards)
                       // Example new cards
                      const updatedPlayerCards = [...playerCards, ...tableCard];
                      
                
                      // Step 3: Update the database with the new combined array
                      return set(ref(db, `rooms/${id}/game/${lastPlayer}/cards`), updatedPlayerCards);
                    })
                    .then(() => {
                      console.log("Player cards updated successfully in Firebase");
                      remove(ref(db,'rooms/'+id+'/showCards'));
                      remove(ref(db,'rooms/'+id+'/TableCards'));
                      remove(ref(db,'rooms/'+id+'/COT'));
                      remove(ref(db,'rooms/'+id+'/TIA'));
                      update(ref(db, 'rooms/'+id), {
                        Chance: myId
                      }).then(()=>{
                        setTimer(45);
                      })
                    })
                    .catch((error) => {
                      console.error("Error updating player cards:", error);
                    });
            
          }
          return newShowCards;

          
        });
      };

      const playMemes = () => {
          setMemeBtn(true);
      }
      const memeOff = () => {
        setMemeBtn(false);
      }

      const setAudio = (num)=> {
        set(ref(db, "rooms/"+id+"/audio"),{
          audioNum: num,
        })
      }

      
    return(
        <View style={styles.container}>
          <StatusBar hidden></StatusBar>
            <ImageBackground source={require('./art/bg.jpg')}
                style={{width: '100%', height: '100%',}}>
              <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', top: '40%'}} onPress={playMemes}>
                  <Image
                    source={require('./art/sideBtn.png')}
                    style={{width: 30, height: 70}}
                  />
              </TouchableOpacity>
            <ImageBackground
            source={require('./art/table.png')}
            style={{width: 550, height: 270, alignSelf: 'center', marginVertical: '6.2%',}}
            >
            <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 30, marginTop: 40, position: 'absolute'}}>
              {cOt}'{tIa}
            </Text>
              <FlatList
                  horizontal
                  style={{ marginTop: 10, width: 'auto', height: 'auto', alignSelf: 'center',}}
                  data={gotCards}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={{alignSelf: 'center'}}>
                      {/* Dynamically generate the image source based on card data */}
                      <TouchableOpacity onPress={() => showPatte(index, item.rank, item.suit)} disabled={mainBtns}>
                        <Image
                          source={showCards[index] ? cardImages[item.suit][item.rank] : require('./Cards/cardBg_r.png')}
                          style={{width: 55,
                            height: 75,
                            margin: 0,
                            resizeMode: 'cover',
                            alignSelf: 'center'
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                />
            </ImageBackground>
            <Text style={{color: 'white', alignSelf: 'flex-start', fontFamily: 'one', fontSize: 20, position: 'absolute', marginTop: 10, left: 10}}>
               Selected cards: {selectedCards.length}
            </Text>
            <Text style={{color: 'white', alignSelf: 'flex-end', fontFamily: 'one', fontSize: 20, position: 'absolute', marginTop: 10, right: 10}}>
               Remaining cards: {cards.length}
            </Text>
            <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20, position: 'absolute', marginTop: 10}}>
                {players[0] == playerChance && players[0]!==undefined ? players[0]+"  is throwing": players[0]}
            </Text>
            <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20, position: 'absolute', marginTop: 320}}>
               You   {timer} secs
            </Text>
            <Text style={{color: 'white', alignSelf: 'flex-start', fontFamily: 'one', fontSize: 20, position: 'absolute', marginTop: 160, transform: [{ rotate: '-90deg' }], marginLeft:  players[1] === playerChance && players[1] !== undefined ? -10 : 30}}>
              {players[1] == playerChance && players[1]!==undefined ? players[1]+"  is throwing": players[1]}
            </Text>
            <Text style={{color: 'white', alignSelf: 'flex-end', fontFamily: 'one', fontSize: 20, position: 'absolute', marginTop: 160, transform: [{ rotate: '90deg' }], paddingHorizontal:  players[2] === playerChance && players[2] !== undefined ? 0 : 30}}>
            {players[2] == playerChance && players[2]!==undefined ? players[2]+"  is throwing": players[2]}
            </Text>
            <TouchableOpacity style={{position: 'absolute', marginTop: 280, left: 30,backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 20, borderRadius: 10 }} disabled={mainBtns} onPress={chancePass}>
              <Text style={{color: 'white', alignSelf: 'flex-start', fontFamily: 'one', fontSize: 20,}}>
                Pass
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end',marginTop: 280,backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 20, borderRadius: 10, right: 10 }} onPress={ThrowCards} disabled={mainBtns}>
              <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,}}>
                Throw
              </Text>
            </TouchableOpacity>            
            
            {btn && (
              <TouchableOpacity style={{alignSelf: 'flex-end', position: 'absolute', marginTop: 40, paddingHorizontal: 30, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingVertical: 5, borderRadius: 20, right: 10}} onPress={shuffleDeck}>
              <Text style={{color: 'white', alignSelf: 'center', fontFamily: 'one', fontSize: 20}}>
                  Shuffle
              </Text>
              </TouchableOpacity>
            )}


                <FlatList
                  horizontal
                  style={{ position: 'absolute', marginTop: 250, width: 440, alignSelf: 'center' }}
                  data={cards}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.cardContainer}>
                      {/* Dynamically generate the image source based on card data */}
                      <TouchableOpacity onPress={() => handleCardPress(item)} disabled={mainBtns}>
                        <Image
                          source={cardImages[item.suit][item.rank]}
                          style={[
                            styles.cardImage,
                            isCardPressed(item) ? styles.pressedButton : null,
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                />

                {isDialogVisible && (

                    <View style={styles.modalContainer} >
                    <StatusBar  hidden/>
                    <View style={styles.dialogContainer}>
                    <StatusBar  hidden/>
                      <Text style={styles.dialogTitle}>Throw it as: </Text>
                      <FlatList style={{width: 400}}
                          data={Tcards}
                          renderItem={Titem}
                          keyExtractor={(item) => item}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                      />
                        <TouchableOpacity style={styles.closeButton} onPress={closeDialog}>
                            <Text style={styles.closeButtonText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </View>

                )}
                

                { cardPicked && (

                  
                <View style={styles.modalContainer} >
                  <Text style={styles.dialogTitle}>
                    Picked card: 
                  </Text>
                  <Animated.Image
                  source={cardImages[pickedCard.cardSuit][pickedCard.cardRank]}
                  style={{
                    width: 100,
                    height: 150,
                    transform: [{ scale:  fadeAnim}],
                  }}
                />
                  
                </View>
               )}   
               {memeBtn && (<View style={styles.modalContainer}>
              <Text style={{color: 'white', fontFamily: 'one', fontSize: 25,marginTop: 20}}>
                Choose your slang that fits:
              </Text>
              <ScrollView style={{marginTop: 10, marginBottom: 20}} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={{borderBottomColor: 'white', borderBottomWidth: 1, paddingHorizontal: 40}} onPress={()=> setAudio(1)}>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25, alignSelf: 'center'}}>
                    Assambhav Bc..!!
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomColor: 'white', borderBottomWidth: 1, paddingTop: 10}} onPress={()=> setAudio(2)}>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25, alignSelf: 'center'}}>
                    Bhai yeh kya ho raha
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomColor: 'white', borderBottomWidth: 1,paddingTop: 10}} onPress={()=> setAudio(3)}>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25, alignSelf: 'center'}}>
                    BC..!!
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomColor: 'white', borderBottomWidth: 1,paddingTop: 10}} onPress={()=> setAudio(4)}>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25, alignSelf: 'center'}}>
                    Bh@dwa sala r@nd! baaz
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomColor: 'white', borderBottomWidth: 1,paddingTop: 10}} onPress={()=> setAudio(5)}>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25, alignSelf: 'center'}}>
                    Chala ja bsdk
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomColor: 'white', borderBottomWidth: 1,paddingTop: 10}} onPress={()=> setAudio(6)}>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25, alignSelf: 'center'}}>
                    Thoda sa BKL
                  </Text>
                </TouchableOpacity>
                
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={memeOff}>
                <Text style={styles.closeButtonText}>
                    Close
                </Text>
            </TouchableOpacity>
            </View>)}

              {lead && ( <View style={styles.modalContainer}>
                <View 
                  style={{ height: 300, width: 300, borderRadius: 20, backgroundColor: 'rgba(0, 20, 0, 0.5)'}}
                >
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 25,marginTop: 20, alignSelf: 'center'}}>
                    GAME OVER
                  </Text>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,marginTop: 10, alignSelf: 'center'}}>
                  ---------- WINNER ----------
                  </Text>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,marginTop: 5, alignSelf: 'center'}}>
                  {winners[0]}
                  </Text>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,marginTop: 5, alignSelf: 'center'}}>
                  {winners[1]}
                  </Text>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,marginTop: 5, alignSelf: 'center'}}>
                  {winners[2]}
                  </Text>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,marginTop: 10, alignSelf: 'center'}}>
                  ---------- LOOSER ----------
                  </Text>
                  <Text style={{color: 'white', fontFamily: 'one', fontSize: 20,marginTop: 5, alignSelf: 'center'}}>
                  {looser.looser}
                  </Text>

                </View>
              </View> )}
                  
            
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
      cardContainer: {
        margin: 0
      },
      cardImage: {
        width: 55,
        height: 75,
        margin: 0,
        resizeMode: 'cover',
      },
      pressedButton: {
        width: 70,
        height: 95,
        resizeMode: 'cover'
      },
      modalContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute'
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

  export default Table;