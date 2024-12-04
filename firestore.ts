'use client'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import app from './config';

const auth = getAuth(app);
const db = getFirestore(app);

export async function storeUserData(username:string, totalPoints: number, friends: string[]) {
  try {
    // Get the authenticated user's ID
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently authenticated.");
    }

    const userId = user.uid;

    // Create a reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Store user data in Firestore
    await setDoc(userDocRef, {
      userId: userId,
      username: username,
      totalPoints: totalPoints,
      friends: friends,
    });

    console.log("User data successfully stored in Firestore.");
  } catch (error:any) {
    console.error("Error storing user data:", error.message);
  }
}

export function get_friends() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(uid)
      // ...
    } else {
      // User is signed out
      // ...
      console.log('none')
    }
  });
}
