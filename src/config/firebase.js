//import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/database';
import '@firebase/storage';
import firebase from 'firebase/compat/app';

import { initializeApp } from '@firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from '@firebase/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  addDoc,
} from '@firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUjmV8JvY1_gKvIYFN0e41xNCnq87Aqb4",
  authDomain: "badbankapp-74313.firebaseapp.com",
  databaseURL: "https://badbankapp-74313-default-rtdb.firebaseio.com",
  projectId: "badbankapp-74313",
  storageBucket: "badbankapp-74313.appspot.com",
  messagingSenderId: "547252267483",
  appId: "1:547252267483:web:5eaaa6c36161bae95fdffe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(firestore, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logInWithEmailAndPassword = async (email, password) => {
  try {
    console.log('executed')
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const initialBalance = 100;
    await addDoc(collection(firestore, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      balance: initialBalance
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message); 
  }
};

const logout = () => {
  signOut(auth);
};

export {
  app, 
  auth, 
  firestore,
  signInWithGoogle,
  signInWithEmailAndPassword, 
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordReset,
  logout,
  signOut
};