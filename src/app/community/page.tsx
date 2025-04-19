import React from 'react';
import Link from 'next/link';

const CommunityMain = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen  p-6  inset-0 bg-cover bg-center z-0" 
    style={{
      backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
      willChange: 'transform',
    }}>

      <div className='bg-white/40 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-md w-full flex justify-center items-center flex-col '>
      <h1 className="text-3xl font-bold mb-8 text-white">Plant Communities 🌿</h1>

      <div className="space-y-4">
        <Link href="/community/create" className="block w-64 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200">
            Create Community
        </Link>

        <Link href="/community/join" className="block w-64 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200">
            Join a Community
        </Link>

        <Link href="/community/joined" className="block w-64 text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200">
            Joined Communities
        </Link>
      </div>
      </div>
    </div>
  );
};

export default CommunityMain;
