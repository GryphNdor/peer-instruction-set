// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

  // apiKey: process.env.APIKEY,
  // authDomain: process.env.AUTHDOMAIN,
  // projectId: process.env.PROJECTID,
  // storageBucket: process.env.STORAGEBUCKET,
  // messagingSenderId: process.env.MESSAGINGSENDERID,
  // appId: process.env.APPID

console.log(firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db
