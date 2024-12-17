'use client'
import React from 'react'
import { getAuth,  onAuthStateChanged  } from "firebase/auth";
import { useState } from 'react';
import app from '../../../config';
import Image from 'next/image';

import Header2 from '../components/header2';


const auth = getAuth(app);
const user = auth.currentUser;
console.log("home")
console.log(user)


export default function InteractiveRecipePage() {
  // State to manage which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    image: true,
    recipe: true,
    chat: false,
  });

  // Toggle the visibility of a section
  const toggleSection = (section) => {
    setExpandedSections((prev) => {
      const toggled = { ...prev, [section]: !prev[section] };
      const expandedCount = Object.values(toggled).filter((v) => v).length;

      // Ensure only two sections are expanded at a time
      if (expandedCount > 2) {
        const toCollapse = Object.keys(toggled).find((key) => key !== section && toggled[key]);
        toggled[toCollapse] = false;
      }
      return toggled;
    });
  };

  return (
    <main className=" min-h-screen p-4">
            {/* Fixed Header */}
            <Header2 title='Comfort Food' subtitle='Live Room'></Header2>

      <br/>
        <br/>
        <br/>
        <br/>


      {/* Image Section */}
      <section className="bg-white shadow-md rounded-lg mb-4">
        <div
          onClick={() => toggleSection('image')}
          className="cursor-pointer p-4 bg-orange-100 rounded-t-lg flex justify-between items-center"
        >
          <h2 className="text-lg font-bold">Image</h2>
          <span className="text-gray-500">{expandedSections.image ? '-' : '+'}</span>
        </div>
        {expandedSections.image && (
          <div className="p-4">
            <Image
              src="/images/greek-pasta-salad.jpg" // Replace with your image path
              alt="Greek Pasta Salad"
              width={800}
              height={400}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </section>

      {/* Recipe Instructions Section */}
      <section className="bg-white shadow-md rounded-lg mb-4">
        <div
          onClick={() => toggleSection('recipe')}
          className="cursor-pointer p-4 bg-orange-100 rounded-t-lg flex justify-between items-center"
        >
          <h2 className="text-lg font-bold">Recipe Instructions</h2>
          <span className="text-gray-500">{expandedSections.recipe ? '-' : '+'}</span>
        </div>
        {expandedSections.recipe && (
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-bold">
                <span>Step 1</span>
                <div className="flex space-x-2">
                  <Image
                    src="/images/user1.png"
                    alt="User 1"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="mt-2 text-gray-700 text-sm">
                <p>
                  Dice 1 cucumber, 1 red bell pepper, and 1 red onion. Halve about 1 cup of cherry
                  tomatoes. Slice 1/4 cup of black or Kalamata olives.
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">Previous</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">Next</button>
            </div>
          </div>
        )}
      </section>

      {/* Live Chat Section */}
      <section className="bg-white shadow-md rounded-lg mb-4">
        <div
          onClick={() => toggleSection('chat')}
          className="cursor-pointer p-4 bg-orange-100 rounded-t-lg flex justify-between items-center"
        >
          <h2 className="text-lg font-bold">Live Chat</h2>
          <span className="text-gray-500">{expandedSections.chat ? '-' : '+'}</span>
        </div>
        {expandedSections.chat && (
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm">
                <strong>Step 1:</strong> Do I need to salt the pasta water?
              </p>
              <p className="text-sm text-right text-gray-500 mt-2">👍 1</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm">
                <strong>Step 3:</strong> Yes, I would put a generous amount.
              </p>
              <p className="text-sm text-right text-gray-500 mt-2">👍 2</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
