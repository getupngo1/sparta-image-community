import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBUKLqdsw1t4TvQOhNfCuJNFbK4qgNZAWY",
  authDomain: "image-community-bb60f.firebaseapp.com",
  projectId: "image-community-bb60f",
  storageBucket: "image-community-bb60f.appspot.com",
  messagingSenderId: "534332545106",
  appId: "1:534332545106:web:b51c393790620df0e9e78b",
  measurementId: "G-C7BJDEEVMX"
}

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export{auth};