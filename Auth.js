import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground} from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Auth() {


    const navigation = useNavigation();
    const [isFontLoaded] = useFonts({
        'main': require('./assets/fonts/two.ttf'),
      });
      if (!isFontLoaded) {
        // Font is still loading
        return null;
      }

  return (

    <View style={styles.container}>
      <ImageBackground
        source={{uri: 'https://firebasestorage.googleapis.com/v0/b/dhaapbaazi.appspot.com/o/bgMain.png?alt=media&token=781d69b8-0f01-48c5-b8e3-4058d0e2fd09'}}
        style={{width: '100%', height: '100%'}}
      >
        <Image
          source={require('./art/dbTxt.png')}
          style={{width: 160, height: 30, alignSelf: 'center', marginTop: 15}}
        />
        <Text style={{ fontSize: 20, color: '#ffffff',marginTop: 0, alignSelf: 'center', fontFamily: 'main'}}>
            The game of dis-honesty
        </Text>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 30}}>
                <TouchableOpacity style={{display: 'flex', flexDirection: 'row', marginLeft: 100}} onPress={()=> navigation.navigate("login")}>
                <Image
                    source={require('./art/login.png')}
                    style={{width: 200, height: 200}}
                />
                
            </TouchableOpacity>
            <TouchableOpacity style={{display: 'flex', flexDirection: 'row', marginRight: 100}} onPress={()=> navigation.navigate('sign')}>
                <Image
                    source={require('./art/signin.png')}
                    style={{width: 200, height: 200,}}
                />
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
});
