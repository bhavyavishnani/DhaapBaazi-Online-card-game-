import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Home from './Home';
import Auth from './Auth';
import Login from './Login';
import Signin from './SignUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Create from './Create';
import Join from './Join';
import Table from './Table';
import CustomDialog from './CustomDialog';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check the stored authentication status
        const storedStatus = await AsyncStorage.getItem('status');
        if (storedStatus === 'true') {
          setIsLoggedIn(true);
          console.log(isLoggedIn);
        }
      } catch (error) {
        console.error('Error reading authentication status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    // Loading state, you can show a loader here if needed
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator initialRouteName={isLoggedIn ? 'home' : 'Auth'}>
        <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
        <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="sign" component={Signin} options={{ headerShown: false }} />
        <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="create" component={Create} options={{ headerShown: false }} />
        <Stack.Screen name="join" component={Join} options={{ headerShown: false }} />
        <Stack.Screen name="table" component={Table} options={{ headerShown: false }} />
        <Stack.Screen name="dialog" component={CustomDialog} options={{ headerShown: false }} />
  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
