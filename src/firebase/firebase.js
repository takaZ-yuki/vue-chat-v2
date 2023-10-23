import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyB8xl1Czb7P3j89yp6LP9lChBtT2wxBEY4",
  authDomain: "vue-chat-88e40.firebaseapp.com",
  projectId: "vue-chat-88e40",
  storageBucket: "vue-chat-88e40.appspot.com",
  messagingSenderId: "940976682409",
  appId: "1:940976682409:web:2491545a04ae24c70fc0b8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Initialize Authentication
const auth = getAuth();
const storage = getStorage();

export default { app, db, auth, storage };
