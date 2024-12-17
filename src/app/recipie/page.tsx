"use client";
import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../config";
import Image from "next/image";

import Header2 from "../components/header2";

const auth = getAuth(app);
const user = auth.currentUser;
console.log("home");
console.log(user);

import { useRouter, usePathname } from 'next/navigation'


export default function RoomPage() {

  const router = useRouter()
  const handleNavigation = () => {
    router.push('/recipieProgress'); // Replace '/new-page' with your desired route
  };
  
	return (
		<main className="h-screen flex flex-col">
			<Header2 title="Comfort Food" subtitle="Room" />

			<section className="flex-1 overflow-y-auto pt-20 px-2">
				<section className="bg-white  overflow-hidden mb-4">
					<Image
						src="/images/comfort-food.jpg"
						alt="Cooking in Kitchen"
						width={800}
						height={600}
						className="w-full h-64 object-cover rounded-3xl"
					/>
					<div className="py-2 px-2">
						<p className="text-black mb-2 font-semibold text-lg">
							3 people are currently in this room
						</p>
						<div className="flex  space-x-4"             onClick={handleNavigation}
            >
							<button className="px-2 py-0 bg-gray-100 text-black text-lg font-semibold rounded-lg">
								+ Join Room
							</button>
							<button className="px-2 py-0 bg-gray-100 text-black text-lg font-semibold rounded-lg">
								+ Join Live Chat
							</button>
						</div>
					</div>
				</section>

				{/* Recipe Section */}
				<section className="bg-gray-100 rounded-xl p-4">
					<h2 className="text-lg font-bold mb-4">
						Grilled Cheese
					</h2>
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center space-x-2">
							{/* Gold circle around 10 */}
							<div className="flex justify-center items-center w-8 h-8 bg-yellow-100 border-2 border-yellow-500 rounded-full">
								<span className="text-yellow-500 font-bold">
									10
								</span>
							</div>
							<p className="text-sm">Points Earned</p>
						</div>
						<div className="flex items-center space-x-2">
							{/* Blue circle around B */}
							<div className="flex justify-center items-center w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded-full">
								<span className="text-blue-500 font-bold">
									B
								</span>
							</div>
							<p className="text-sm">Beginner Recipe</p>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4 mb-4">
						<div className="bg-red-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Prep Time</p>
							<p className="font-bold text-gray-700">5 min.</p>
						</div>
						<div className="bg-red-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Cook Time</p>
							<p className="font-bold text-gray-700">7 min.</p>
						</div>
						<div className="bg-red-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Total Time</p>
							<p className="font-bold text-gray-700">12 min.</p>
						</div>
					</div>

					<div className="grid grid-cols-4 gap-4 mb-4">
						<div className="bg-green-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Calories</p>
							<p className="font-bold text-gray-700">807 g</p>
						</div>
						<div className="bg-green-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Carbs</p>
							<p className="font-bold text-gray-700">57 g</p>
						</div>
						<div className="bg-green-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Protein</p>
							<p className="font-bold text-gray-700">33 g</p>
						</div>
						<div className="bg-green-100 text-center p-2 rounded-lg">
							<p className="text-sm text-gray-500">Fats</p>
							<p className="font-bold text-gray-700">46 g</p>
						</div>
					</div>

					<div>
						<h3 className="text-base font-bold mb-2">Ingredients</h3>
						<p className="text-gray-600 text-base">
							Sour Dough Bread, Salted Butter, Ceddar Cheese, Mozzarella
						</p>
					</div>
				</section>
			</section>
		</main>
	);
}
