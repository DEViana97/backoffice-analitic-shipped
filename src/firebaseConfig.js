import firebase from "firebase/app";
import "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCjbEg6EIoWYw6FkQhK00jIsrEKB73PFZo",
  authDomain: "rotas-c4dfc.firebaseapp.com",
  databaseURL: "https://rotas-c4dfc-default-rtdb.firebaseio.com",
  projectId: "rotas-c4dfc",
  storageBucket: "rotas-c4dfc.appspot.com",
  messagingSenderId: "347061799366",
  appId: "1:347061799366:web:41393f2f341a257acacac7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage();
