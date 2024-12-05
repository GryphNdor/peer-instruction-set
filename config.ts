// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_2rnxAQyASkqHihwsCbTwZE9WlabfjuY",
  authDomain: "peer-instruction-set.firebaseapp.com",
  projectId: "peer-instruction-set",
  storageBucket: "peer-instruction-set.firebasestorage.app",
  messagingSenderId: "473377321315",
  appId: "1:473377321315:web:1a70eeba29daf91315a356"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default app