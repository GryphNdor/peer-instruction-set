'use client'
import React, { useState } from 'react';
import './signup.css';
import app from '../../../config';
import { getAuth, createUserWithEmailAndPassword, updateProfile, updateCurrentUser,} from "firebase/auth";
import { useRouter } from 'next/navigation';
import { collection, addDoc } from "firebase/firestore";
import Logo from '../imgs/cookingcrew.png'
import { create } from 'domain';
import storeUserData from '../firestore'

const auth = getAuth(app);


const Signup: React.FC = () => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();



  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log("here")
      storeUserData(username, 0, [])
      router.push('/search');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  };

  return (
    <div className="login-container">
      <div className="logo">
        <div className="icon">
        <img src={Logo.src} alt="cooking crew Logo" className='icon' />
        </div>
        <h1>Cooking Crew</h1>
      </div>
      <form onSubmit={handleSignup} className="login-form">
        <input
          id = 'Username'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
            id = "email"
            type="text"
            placeholder ="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input
              id = 'password'
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;