import firebase from "firebase/app";
import "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDJGJdZ0NaVy5pFpidUuoIEfU08hMZwDXs",
  authDomain: "backoff-analitic-test.firebaseapp.com",
  projectId: "backoff-analitic-test",
  storageBucket: "backoff-analitic-test.appspot.com",
  messagingSenderId: "475409811121",
  appId: "1:475409811121:web:32d822f51e784291338490",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage();
