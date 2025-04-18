"use client";

import SignInBtn from "../../components/SignInBtn";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { status, data: session } = useSession();
  console.log(session?.user?.id)
  return (
    <>
    
      {status === "authenticated" ? (
        
        <h1>{session?.user?.name}</h1>
      ) : (
        <SignInBtn />
      )}
    </>
  );
}
