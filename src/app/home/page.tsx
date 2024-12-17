"use client";
import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../config";
import {  IconUser } from '@tabler/icons-react'

import Header from "../components/header";

const auth = getAuth(app);
const user = auth.currentUser;
console.log("home");
console.log(user);

import { useRouter, usePathname } from 'next/navigation'



export default function Home() {

  const router = useRouter()
const handleNavigation = () => {
  router.push('/recipie'); // Replace '/new-page' with your desired route
};

	const rooms = [
		{
			title: "Comfort Food",
			participants: 3,
			image: "/images/comfort-food.jpg", // Replace with the actual image path
		},
		{
			title: "Struggle Meals VT",
			participants: 9,
			image: "/images/struggle-meals.jpg", // Replace with the actual image path
		},

		{
			title: "Small Woks",
			participants: 3,
			image: "/images/chinese.jpg", // Replace with the actual image path
		}
	];

	return (
		<main className="h-screen flex flex-col ">
			{/* Fixed Header */}

			<Header />

			{/* Scrollable Content */}
			<section className="flex-1 overflow-y-auto pt-28 px-2">
				<h2 className="text-2xl font-semibold mb-4 ml-4">Join Rooms</h2>
				<div className="">
					{rooms.map((room, index) => (
						<div
            onClick={handleNavigation}

							key={index}
							className="flex-row bg-white  overflow-hidden mt-0"
						>
							{/* Responsive Image */}
							<img
								src={room.image}
								alt={room.title}
								className="  flex-shrink-0 rounded-3xl"
							/>
							<div className="flex justify-between items-center flex-auto p-4">
								<span className="font-semibold  text-lg">
									{room.title}
								</span>
								<span className="text-lg  flex items-center">
                <IconUser size={20} className="mr-1" /> {/* Replace the emoji with IconUser */}

									{room.participants}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>
      <br />
      <br /><br />
		</main>
	);
}
