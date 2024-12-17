"use client";
import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../config";
import Image from "next/image";
import { useState } from 'react';


import Header2 from "../components/header2";

const auth = getAuth(app);
const user = auth.currentUser;
console.log("home");
console.log(user);

// Mock data for streaks
const streaksData = [
  { name: 'You', days: 8, points: 40, avatar: '/images/user1.png' },
  { name: 'Tim', days: 2, points: 10, avatar: '/images/user2.png' },
  { name: 'Tam', days: 4, points: 20, avatar: '/images/user3.png' },
  { name: 'Joe', days: 1, points: 5, avatar: '/images/user4.png' },
];

// Calendar mock data
const calendarData = [
  { day: 'Mon', streak: false },
  { day: 'Tue', streak: false },
  { day: 'Wed', streak: true },
  { day: 'Thu', streak: true },
  { day: 'Fri', streak: true },
  { day: 'Sat', streak: true },
  { day: 'Sun', streak: false },
];

export default function StreakPage() {
  const [currentMonth] = useState('Week 50'); // Mock current month

  return (
    <main className="min-h-screen p-2 mt-24">
      {/* Calendar Section */}
	  <Header2 title="Cooking Record" subtitle="Streak"></Header2>
      <section className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-500">&lt;</button>
          <h2 className="text-lg font-bold">{currentMonth}</h2>
          <button className="text-gray-500">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                day.streak ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <span className="text-sm">{day.day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  day.streak ? 'bg-orange-200' : 'bg-gray-200'
                }`}
              >
                {day.streak && <span>🔥</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Friends' Streak Section */}
      <section>
        <h2 className="text-md font-bold mb-4">Friends' Streak</h2>
        <div className="space-y-4">
          {streaksData.map((friend, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg flex items-center p-4"
            >
              {/* Avatar */}
              <Image
                src={friend.avatar}
                alt={`${friend.name}'s avatar`}
                width={48}
                height={48}
                className="rounded-full"
              />
              {/* Friend Details */}
              <div className="flex-1 ml-4">
                <h3 className="text-sm font-bold">{friend.name}</h3>
                <p className="text-xs text-gray-500">{friend.days} Days</p>
              </div>
              {/* Points */}
              <div className="flex items-center space-x-2 text-orange-500">
                <span>🔥</span>
                <span className="text-sm font-bold">{friend.points}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
