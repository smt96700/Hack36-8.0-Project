"use client";

import SignInBtn from "./SignInBtn";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { status, data: session } = useSession();

  return (
    <>
    
      {status === "authenticated" ? (
        <h1>{session?.user?.name || "Sumit Chaurasiya"}</h1>
      ) : (
        <SignInBtn />
      )}
    </>
  );
}
