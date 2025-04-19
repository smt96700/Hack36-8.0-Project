"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover flex items-center justify-between px-6 md:px-20 py-24 relative"
      style={{
        backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
      }}
    >
      <div className="absolute bg-black inset-0 opacity-45"></div>
      {/* Left Section — Plant-related Text */}
      <div className="z-50 hidden md:flex justify-center items-center flex-col text-center max-w-xl space-y-4 text-white">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
          "Nurturing Nature, One Plant at a Time"
        </h2>
        <p className="text-lg md:text-xl font-light">
          At Plantelligence, we believe every plant deserves the best care, guidance, and connection.
          <br />
          Grow your green companions with smart solutions that ensure a healthy, thriving ecosystem.
        </p>
      </div>

      {/* Right Section — User Info */}
      <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 max-w-xl w-full text-white space-y-8">
        
        {/* Avatar */}
        <div className="flex justify-center">
          <img
            src={session?.user?.image || "/default-avatar.png"}
            alt="User"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-green-400 shadow-lg"
          />
        </div>

        {/* User Name */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-green-300 text-center">
          {session?.user?.name}
        </h1>

        {/* Email Section */}
        <div className="text-center space-y-2">
          <h3 className="text-xl md:text-2xl text-gray-200 font-semibold">
            Email
          </h3>
          <p className="text-md md:text-lg text-gray-100 break-words">
            {session?.user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
