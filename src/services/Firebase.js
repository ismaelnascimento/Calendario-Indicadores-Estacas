import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkIRtsrx6cU0mseszV7boHbeUhjpxwwA4",
  authDomain: "calendarioestacapacajus.firebaseapp.com",
  projectId: "calendarioestacapacajus",
  storageBucket: "calendarioestacapacajus.appspot.com",
  messagingSenderId: "79377217706",
  appId: "1:79377217706:web:aa9332dbfe68b34c7838d3",
  measurementId: "G-DZR5N43CQD",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const providerGoogle = new firebase.auth.GoogleAuthProvider();

export { db, auth, providerGoogle, firebase, storage };
