'use client';

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
    <div
      className="min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center relative px-6 md:px-24 py-24"
      style={{
        backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto bg-white/50 backdrop-blur-md p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Joined Communities</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading communities...</p>
        ) : communities.length === 0 ? (
          <p className="text-center text-gray-500">You haven’t joined any communities yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {communities.map((community) => (
              <div
                key={community._id}
                className="bg-white border border-gray-200 shadow-xl rounded-xl p-6 flex flex-col justify-between transform hover:scale-105 transition-all"
              >
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-2">
                    {community.communityName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">{community.description}</p>
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
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      View Community
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinedCommunities;
