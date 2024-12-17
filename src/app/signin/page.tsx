'use client'
import React, { useState } from 'react';
import './login.css';
import app from '../../../config';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { useRouter } from 'next/navigation';
import Logo from '../imgs/cookingcrew.png'
import { redirect } from 'next/navigation';



// Initialize Firebase Auth if not already done
const auth = getAuth(app);

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      router.push('/search')
      // ...
    })
    .catch((error) => {
      console.log('error')
      const errorCode = error.code;
      const errorMessage = error.message;
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
      <form onSubmit={handleLogin} className="login-form">
      <input
            id = 'email'
            type="text"
            placeholder ="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input
          id = 'password'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <center>
          <p> or signup <a href="./signup"><u>here</u></a></p>
        </center>
      </form>
    </div>
  );
};

export default Login;