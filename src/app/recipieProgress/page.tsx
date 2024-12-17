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




export default function RecipiePage() {
  // State to manage step visibility
  const [stepVisibility, setStepVisibility] = useState({
    step1: true,
    step2: false,
    step3: false,
  });

  // Dummy data for user progress
  const userProgress = {
    step1: ['/images/user1.png', '/images/user2.png'], // Replace with user avatars
    step2: ['/images/user3.png'],
    step3: ['/images/user4.png'],
  };

  // Toggle step visibility
  const toggleStep = (step) => {
    setStepVisibility((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  return (
    <main className="relative  min-h-screen p-2">

      <Header2 title='Comfort Food' subtitle='Preview'></Header2>
      <section className="bg-white rounded-3xl pt-24 p-2 mb-4">
        <Image
          src="/images/grilled-cheese.png" // Replace with your image path
          alt="Greek Pasta Salad"
          width={800}
          height={400}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Grilled Cheese</h1>
          <p className="text-gray-500 text-sm flex items-center">
            <span role="img" aria-label="people">
              👤
            </span>{' '}
            4
          </p>
        </div>
      </section>

      {/* Recipe Instructions */}
      <section className="bg-gray-100  rounded-3xl p-4 mb-4">
        <h2 className="text-lg font-bold mb-4">Recipe Instructions</h2>

        {/* Step 1 */}
        <div className="mb-4">
          <button
            onClick={() => toggleStep('step1')}
            className="flex items-center justify-between w-full bg-orange-200 text-orange-700 px-4 py-2 rounded-3xl font-bold"
          >
            <span>Step 1</span>
            <div className="flex -space-x-2">
              {userProgress.step1.map((user, index) => (
                <Image
                  key={index}
                  src={user}
                  alt={`User ${index + 1}`}
                  width={24}
                  height={24}
                  className="rounded-full border border-white"
                />
              ))}
            </div>
          </button>
          {stepVisibility.step1 && (
            <div className="mt-2 text-gray-700 text-sm">
              <p>
                Butter and Toast Bread              
              </p>
              <ul className="list-disc list-inside mt-2"><li>Butter bread – Slather both sides of each piece of bread with the butter (yes, all 4 sides!).</li>
                <li>Light toast – Heat a heavy-based skillet or frying pan over medium low heat (no oil or butter). Place both pieces of bread in the skillet and lightly toast for 1 minute to warm it through and create a light crust. (When we flip, this gives the cheese a head start).</li>
              </ul>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="mb-4">
          <button
            onClick={() => toggleStep('step2')}
            className="flex items-center justify-between w-full bg-orange-200 text-orange-700 px-4 py-2 rounded-3xl font-bold"
          >
            <span>Step 2</span>
            <div className="flex -space-x-2">
              {userProgress.step2.map((user, index) => (
                <Image
                  key={index}
                  src={user}
                  alt={`User ${index + 1}`}
                  width={24}
                  height={24}
                  className="rounded-full border border-white"
                />
              ))}
            </div>
          </button>
          {stepVisibility.step2 && (
            <div className="mt-2 text-gray-700 text-sm">
              <p>
              Pile on cheese – Flip one slice of bread, then pile on the cheddar cheese followed by the mozzarella. Place the other slice of bread on top, with the hot toasted side in contact with the cheese.

              </p>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div>
          <button
            onClick={() => toggleStep('step3')}
            className="flex items-center justify-between w-full bg-orange-200 text-orange-700 px-4 py-2 rounded-3xl font-bold"
          >
            <span>Step 3</span>
            <div className="flex -space-x-2">
              {userProgress.step3.map((user, index) => (
                <Image
                  key={index}
                  src={user}
                  alt={`User ${index + 1}`}
                  width={24}
                  height={24}
                  className="rounded-full border border-white"
                />
              ))}
            </div>
          </button>
          {stepVisibility.step3 && (
            <div className="mt-2 text-gray-700 text-sm">

              <ul className="list-disc list-inside mt-2">
                <li>Cook 3 minutes – Cook for 3 minutes or until the bread is evenly golden and crisp, pressing down lightly with a spatula every now and then. If it's browning too quickly, remove remove from the stove to cool down a bit and lower heat.
</li>
                <li>Flip, 3 minutes – Turn the sandwich over, and cook the other side for 3 minutes or until the bread is golden and the cheese is melted.
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Floating Button */}
      <button className="fixed bottom-16 right-4 bg-orange-500 text-white px-6 py-3 rounded-3xl shadow-lg hover:bg-orange-600 transition duration-300">
        Cook with the Crew
      </button>
    </main>
  );
}

