"use client";

import Image from "next/image";
// import logo from "../Images/googlelogo.png"
import { signIn } from "next-auth/react";
export default function SignInBtn() {
  return (
    <div className="flex items-center space-x-2 border border-gray-300 bg-blue-400 px-4 py-2 rounded cursor-pointer hover:shadow-md transition gap-10">
      <div onClick={() => signIn("google")} className="flex items-center space-x-2">
      <Image src={''} alt="Google Logo" width={80} height={10}  />
      <span className="text-gray-700 font-bold"> 
        Sign in with Google wewe</span>
        </div>
    </div>
  );
}
