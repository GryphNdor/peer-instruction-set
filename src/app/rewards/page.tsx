'use client'
import React from 'react'
import { getAuth,  onAuthStateChanged  } from "firebase/auth";
import { useState } from 'react';
import app from '../../../config';
import Image from 'next/image';

import Header2 from '../components/header2';

import { useRouter, usePathname } from 'next/navigation'



const auth = getAuth(app);
const user = auth.currentUser;
console.log("home")
console.log(user)



export default function CookingRecordPage() {
  // Mock data for cooking records
  const records = [
    {
      id: 1,
      title: 'Grilled Cheese',
      recipeLevel: 'Beginner Recipe',
      points: 5,
      group: 'Comfort Food',
      date: 'Oct 21',
      image: '/images/grilled-cheese.jpg', // Replace with your actual image path
    },
    {
      id: 2,
      title: 'Chicken Stir Fry',
      recipeLevel: 'Intermediate Recipe',
      points: 25,
      group: 'Tiny Woks',
      date: 'Oct 20',
      image: '/images/chicken-stir-fry.jpg', // Replace with your actual image path
    },
    {
      id: 3,
      title: 'Beef Wellington',
      recipeLevel: 'Advanced Recipe',
      points: 40,
      group: 'MasterChef',
      date: 'Oct 19',
      image: '/images/beef-wellington.jpg', // Replace with your actual image path
    },
  ];

  const router = useRouter()
  const handleNavigation = () => {
    router.push('/streak'); // Replace '/new-page' with your desired route
  };

  return (
    <main className=" min-h-screen p-4">
      {/* Header Section */}

      
      <Header2 title='Cooking Record' subtitle='History'/>
      <br/>
        <br/>
        <br/>
        <br/>

      <div className="bg-gray-100 rounded-3xl p-4 mb-6"  onClick={handleNavigation}>
        <div className="flex-col items-center space-x-4">
          <div className="flex-shrink-0">
            
          </div>
        </div>
        <div className="mt-2 rounded-lg p-2 flex items-center justify-between">
        <Image
              src="/images/badge.png" // Replace with your actual trophy image
              alt="Trophy Icon"
              width={100}
              height={100}
              className="rounded-full"
            />
          <div>
            <h2 className="text-base font-bold">Level 7</h2>
            <p className="text-base text-gray-500">750 Points Earned</p>
          </div>
          <Image
            src="/images/user1.png" // Replace with your actual user avatar image
            alt="User Avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
      </div>

      {/* History Section */}
      <section>
        <h2 className="text-md font-bold mb-4">October 2024</h2>
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white shadow-md rounded-lg flex items-center p-4 space-x-4"
            >
              {/* Recipe Image */}
              <Image
                src={record.image}
                alt={record.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />

              {/* Recipe Details */}
              <div className="flex-1">
                <h3 className="text-sm font-bold">{record.title}</h3>
                <p className="text-xs text-gray-500 flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                    {record.recipeLevel[0]}
                  </span>
                  <span>{record.recipeLevel}</span>
                </p>
                <p className="text-xs text-gray-500">{record.points} Points Earned</p>
                <p className="text-xs text-gray-500">
                  {record.group} &bull; {record.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
