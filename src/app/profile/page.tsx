'use client';
import React from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth} from "firebase/auth";
import app from '../../../config';
import './profile.css'
import { getUserProfile, getFriends } from '../../../firestore';

const auth = getAuth(app);
const user = auth.currentUser;
const id = JSON.stringify(user?.uid);
const profile = await getUserProfile(user?.uid)
const Achievements: React.FC = () => {
  const userProfile = {
    // username: profile["username"],
    // points: profile['totalPoints'],
    // friends: profile['friends'],
    //example recipes 
    month: '2024',
    //recipe place holder
    recipes: [
      {
        name: 'Grilled Cheese',
        type: 'Beginner Recipe',
        points: 5,
        category: 'Comfort Food',
        date: 'Oct 21',
        imageUrl: 'https://via.placeholder.com/100', //img place holder
        badge: 'B',
      }
    ],
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* Profile Section */}
      <div className="profile flex items-center mb-6">
        <div className="w-16 h-16 flex items-center justify-center bg-purple-500 rounded-full">
          {/* Replace with the badge icon */}
          <img
            src="https://via.placeholder.com/40"
            alt="Badge Icon"
            className="w-12 h-12"
          />
        </div>
        <div className="ml-4">
          <p className="text-black-500 font-medium"> <strong>{profile["username"]}</strong>  {profile["totalPoints"]} Points Earned</p>
        </div>
      </div>

      {/* Month Header */}
      <h3 className="text-lg font-semibold text-gray-700">{userProfile.month}</h3>

      {/* Recipe List */}
      <div className="mt-4 space-y-4">
        {userProfile.recipes.map((recipe, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            {/* Recipe Image */}
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-16 h-16 object-cover rounded-md"
            />

            {/* Recipe Details */}
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold">{recipe.name}</h3>
              <p className="text-sm text-gray-600">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-white ${
                    recipe.badge === 'B'
                      ? 'bg-blue-500'
                      : recipe.badge === 'I'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                >
                  {recipe.badge}
                </span>{' '}
                {recipe.type}
              </p>
              <p className="text-sm text-gray-500">
                {recipe.points} Points Earned
              </p>
              <p className="text-sm text-gray-500">
                {recipe.category} • {recipe.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
