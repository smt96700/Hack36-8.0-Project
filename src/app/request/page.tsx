"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Request } from "@/types/Request";

export default function IncomingRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const { status, data: session } = useSession();
  const [acceptStates, setAcceptStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch(`/api/request?userId=${session?.user?.id}`);
      const data = await res.json();
      console.log("Incoming Requests", data);
      setRequests(data);
    };
    fetchRequests();
  }, [status]);

  const handleCheckboxChange = (id: string) => {
    setAcceptStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSend = async (id: string) => {
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
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, accept: true } : req
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/70 backdrop-blur-md max-w-5xl mx-auto p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-900">
          🌱 Incoming Plant Care Requests
        </h1>

        {Array.isArray(requests) && requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  🌿 {request.plantId?.name}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Position:</strong> {request.plantId?.position}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>From:</strong> {request.from.name} ({request.from.email})
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>To:</strong> {request.to.name} ({request.to.email})
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Accepted:</strong>{" "}
                  <span className={request.accept ? "text-green-700 font-semibold" : "text-red-500"}>
                    {request.accept ? "Yes" : "No"}
                  </span>
                </p>

                {!request.accept && (
                  <>
                    <label className="flex items-center space-x-2 text-sm text-gray-800 mb-3">
                      <input
                        type="checkbox"
                        checked={!!acceptStates[request._id]}
                        onChange={() => handleCheckboxChange(request._id)}
                        className="accent-green-600"
                      />
                      <span>I want to take care of this plant</span>
                    </label>

                    {acceptStates[request._id] && (
                      <button
                        onClick={() => handleSend(request._id)}
                        className="w-full py-2 mt-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                      >
                        ✅ Confirm Handover
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-800 font-medium text-lg">
            No incoming requests at the moment 🌾
          </p>
        )}
      </div>
    </div>
  );
}
