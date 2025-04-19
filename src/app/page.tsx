"use client"
import Image from "next/image";
import backgroundImg from '../../public/backgroundImages/mainImg.jpeg'

export default function Home() {
  return (
    
    <div
      className="bg-green-600 min-h-screen grid grid-cols-1 md:grid-cols-2 p-10 gap-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/backgroundImages/mainImg.jpeg')" }}
    >
             <h1>"Smart care for your green companions."
"Grow smart. Connect naturally."
"Plant care meets intelligence."</h1>
             </div>
  );
}
