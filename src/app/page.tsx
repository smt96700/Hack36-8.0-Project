"use client";
import Image from "next/image";
import backgroundImg from '../../public/backgroundImages/mainImg.jpeg';
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>Plantelligence | Home</title>
        <meta name="description" content="Care for your plants intelligently and sustainably." />
      </Head>
      <main>

        <div
          className="relative min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center px-6 md:px-20 py-24"
          style={{
            backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* Blur Box */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-10 md:p-16 max-w-3xl text-center text-white shadow-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-green-300">
              Welcome To <span className="text-green-400">Plantelligence</span>
            </h1>

            <p className="text-lg md:text-xl font-light text-gray-200">
              “Smart care for your green companions.” <br />
              “Grow smart. Connect naturally.” <br />
              “Plant care meets intelligence.”
            </p>

            {/* <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300">
          Explore Now
        </button> */}
          </div>
        </div>

      </main>

    </>
  );
}
