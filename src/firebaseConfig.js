import firebase from "firebase/app";
import "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyC2eW7Jakhcar-qL-zlS1k_NnLwebbTIkw",
  authDomain: "rotas-de-lixo.firebaseapp.com",
  projectId: "rotas-de-lixo",
  storageBucket: "rotas-de-lixo.appspot.com",
  messagingSenderId: "111295533220",
  appId: "1:111295533220:web:4143b2baf8f9c8fba91631",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage();
