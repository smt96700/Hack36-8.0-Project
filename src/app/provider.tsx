// In this file we will create a context provider for the app. This will allow us to manage the state of the app and provide it to all components in the app.

'use client';
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children}: any) => {
  return (
    // Seesion provider:-  This makes sure all child components have access to authentication context.
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}