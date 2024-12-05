'use client'
import React, { useState } from 'react';
import app from '../../config';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { useRouter } from 'next/navigation';



// Initialize Firebase Auth if not already done
const auth = getAuth(app);

export default function goToSignIn() {
  const router = useRouter();
    return (
      router.push('/signin')
    )
  }