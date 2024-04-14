import {initializeApp} from 'firebase/app'
import {getDatabase} from 'firebase/database';
import { set, ref } from 'firebase/database';


const firebaseConfig = {

  apiKey: "AIzaSyBX48bKkux8mdL6JfwrTZzu0ZmzQ9s9TkE",

  authDomain: "dhaapbaazi.firebaseapp.com",

  databaseURL: "https://dhaapbaazi-default-rtdb.firebaseio.com",

  projectId: "dhaapbaazi",

  storageBucket: "dhaapbaazi.appspot.com",

  messagingSenderId: "623720358676",

  appId: "1:623720358676:web:5114aac04d1dfbc3fad801",

  measurementId: "G-DJ7JE7VW68"

  
  };

  const app =  initializeApp(firebaseConfig);
  
  
  const db = getDatabase(app);


export {db};