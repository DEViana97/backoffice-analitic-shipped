import firebase from "firebase/app";
import "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage();
