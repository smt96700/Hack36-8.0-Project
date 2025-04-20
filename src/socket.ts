// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

if (typeof window !== "undefined") {
  // ► Use the same host & port your Next.js app is served from.
  const url =
    process.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://localhost:3000";

  // ► Only create one socket instance
  socket = io(url, {
    transports: ["websocket"],       // force WebSocket (optional)
    autoConnect: true,               // connect immediately
    reconnectionAttempts: 5,         // retry up to 5 times
  });
}

export { socket };
