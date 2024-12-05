import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore, doc, setDoc, getDoc , collection, query, where, getDocs} from "firebase/firestore";
import app from './config';
import { range } from "@mantine/hooks";


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

//returns an object over the current user
//access fields by profile["field name"]
export async function getUserProfile(userId: any){
  try {
    const docReference = doc(db, "users", userId); // Get the document reference.
    const docSnapshot = await getDoc(docReference); // Get a snapshot of the document.
    const profile = docSnapshot.data();
    return profile;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

};

//returns the profiles of the user's friends
export async function getFriends(friends: Array<string>){
  const friend_profiles: any[] = [];
    for (var i = 0; i < friends.length; i++){
      var userRef = collection(db, 'users')
      var friend = query(userRef, where("username", "==", friends[i]));
      const userSnapshot = await getDocs(friend); 
      userSnapshot.forEach((doc) => {
        friend_profiles.push({ id: doc.id, ...doc.data() }); // Push document data into results array
    });
    }
    var friend1 = friend_profiles[0]
    console.log(friend1['username'])
}