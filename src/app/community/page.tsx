import React from 'react';
import Link from 'next/link';

const CommunityMain = () => {
  return (
    <div
      className="bg-white flex flex-col items-center justify-center min-h-screen p-8 inset-0 bg-cover bg-center z-0"
      style={{
        backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
        willChange: 'transform',
      }}
    >
      <div className='bg-white/50 backdrop-blur-md rounded-2xl shadow-2xl p-12 max-w-lg w-full flex justify-center items-center flex-col'>
        <h1 className="text-4xl font-bold mb-12 text-green-800 text-center">
          Plant Communities 🌿
        </h1>

        <div className="space-y-6">
          <Link
            href="/community/create"
            className="block w-72 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300"
          >
            Create Community
          </Link>

          <Link
            href="/community/join"
            className="block w-72 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300"
          >
            Join a Community
          </Link>

          <Link
            href="/community/joined"
            className="block w-72 text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300"
          >
            Joined Communities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityMain;
