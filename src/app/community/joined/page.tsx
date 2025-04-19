"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Community } from "@/types/Community";
import Link from "next/link";

const JoinedCommunities = () => {
  const { status, data: session } = useSession();
  const userId = session?.user?.id;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      allJoinedCommunities();
    }
  }, [userId]);

  const allJoinedCommunities = async () => {
    try {
      const res = await fetch(`/api/community/joined?userId=${userId}`);
      if (!res.ok) {
        console.error("Error fetching communities");
      } else {
        const data = await res.json();
        setCommunities(data);
      }
    } catch (error) {
      console.error("Error fetching joined communities", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div
    //   className="min-h-screen bg-white p-6  inset-0 bg-cover bg-center z-0"
    //   style={{
    //     backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
    //     willChange: "transform",
    //   }}
    // >
      <div className="bg-white/50 max-w-4xl mx-auto p-6 backdrop-blur-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Joined Communities</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading communities...</p>
      ) : communities.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t joined any communities yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {communities.map((community) => (
            <div
              key={community._id}
              className="bg-white border border-gray-200 shadow-md rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-1">
                  {community.communityName}
                </h2>
                <p className="text-sm text-gray-600 mb-4">{community.description}</p>
              </div>
              <div className="mt-auto">
                <Link
                  href={{
                    pathname: `/community/joined/${community._id}`,
                    query: {
                      name: community.communityName,
                      desc: community.description,
                    },
                  }}
                >
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    View Community
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedCommunities;
