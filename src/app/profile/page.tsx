"use client";

import Laff from "../../components/Leaf2";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div
      className="parallax-bg inset-0 min-h-screen grid grid-cols-1 md:grid-cols-2 p-4 md:p-10 gap-4 bg-cover bg-center bg-fixed  z-0"
      style={{ backgroundImage: "url('/backgroundImages/mainImg.jpeg')" }}
    >
      {/* Left Section — Hidden on Mobile */}
      <div className="hidden md:flex justify-center items-center rounded-2xl h-[90vh]">
        {/* Optional left side content */}
      </div>

      {/* Right Section — Always Visible */}
      <div className="relative flex justify-center items-center md:rounded-2xl h-auto md:h-[80vh] overflow-visible md:overflow-hidden bg-transparent md:bg-gradient-to-br md:from-green-100 md:via-green-50 md:to-white md:shadow-xl">
        
        {/* Leaf SVG hidden on mobile */}
        <div className="absolute inset-0 z-0 opacity-20 hidden md:block">
          <Laff />
        </div>

        {/* Inner Card */}
        <div className="bg-white relative z-10 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-6">
            
            {/* Avatar */}
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt="User"
              className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-green-300 shadow-lg"
            />

            {/* Name */}
            <div className="w-full">
              <h1 className="text-2xl md:text-3xl font-agbalumo text-green-800 break-words whitespace-normal">
                {session?.user?.name}
               
              </h1>
            </div>

            {/* Email */}
            <div className="w-full text-left font-bold break-words whitespace-normal">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-500">Email</h3>
              <p className="text-lg md:text-xl text-gray-700 break-words whitespace-normal">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
