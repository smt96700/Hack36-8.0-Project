"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Request } from "@/types/Request";

export default function IncomingRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const { status, data: session } = useSession();
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch(`/api/request?userId=${session?.user?.id}`);
      const data = await res.json();
      console.log("Incoming Requests", data);
      setRequests(data);
    };
    fetchRequests();
  }, [status]);

  const handleSend = async (id: any) => {
    try {
      const res = await fetch(`/api/request?reqId=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Accepted Request", data);
      alert("Plant has been handovered to you now");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="min-h-screen p-6 bg-white"
      style={{
        backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        willChange: "transform",
      }}
    >
      <div className="bg-white/50 backdrop-blur-lg max-w-4xl mx-auto p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Incoming Requests
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(requests) && requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-white/30 backdrop-blur p-4 rounded-xl shadow border border-gray-300"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Plant ID: {request.plantId}
                </h2>
                <p className="text-sm text-gray-700">
                  <strong>From:</strong> {request.from}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>To:</strong> {request.to}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Accepted:</strong>{" "}
                  {request.accept === true ? "Yes" : "No"}
                </p>

                {!request.accept && (
                  <div className="mb-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-800">
                      <input
                        type="checkbox"
                        checked={accept}
                        onChange={(e) => setAccept(e.target.checked)}
                        className="accent-green-500"
                      />
                      <span>Accept request to take care of this plant</span>
                    </label>
                  </div>
                )}

                {!request.accept && accept && (
                  <button
                    onClick={() => handleSend(request._id)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Confirm
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-700">
              No incoming requests.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
