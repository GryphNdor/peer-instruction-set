'use client'
import React from 'react'
import { getAuth,  onAuthStateChanged  } from "firebase/auth";
import app from '../../../config';

const auth = getAuth(app);
const user = auth.currentUser;
console.log("search")
console.log(user)
export default function Search() {
  return (
    
    <div>search</div>
  )
}
