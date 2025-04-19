'use client'
import React, { useState } from 'react'
import { Community } from '@/types/Community'
import { useSession } from 'next-auth/react'

const JoinCommunity = () => {
  const [communities, setCommunities] = useState<Community[]>([])
  const [accessLocation, setAccessLocation] = useState(false)
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [maxDist, setMaxDist] = useState(0)
  const [hasFetched, setHasFetched] = useState(false)

  const { data: session } = useSession()
  const userId = session?.user?.id

  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude)
      setLongitude(pos.coords.longitude)
      setAccessLocation(true)
      alert('📍 Location fetched successfully!')
    })
  }

  const fetchCommunity = async () => {
    try {
      const res = await fetch(
        `/api/community/join?longitude=${longitude}&latitude=${latitude}&maxDist=${maxDist}`
      )
      setHasFetched(true)
      if (!res.ok) {
        console.error('Error fetching communities.')
      } else {
        const data = await res.json()
        setCommunities(data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const joinCommunity = async (communityId: string) => {
    try {
      const res = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, communityId }),
      })

      if (!res.ok) {
        console.error('Error joining community.')
      } else {
        const data = await res.json()
        alert(data.message)
        setCommunities((prev) => prev.filter((c) => c._id !== communityId))
      }
    } catch (error) {
      console.error('Join error:', error)
    }
  }

  const filteredCommunities = communities.filter(
    (community) => !community.members.includes(userId)
  )

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center relative px-6 md:px-20 py-24"
      style={{
        backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
      }}
    >
      {/* Overlay for darkening the background */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-60 z-0" /> */}

      <div className="relative z-10 max-w-3xl mx-auto bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-900">🌿 Join a Community Near You</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={setLocation}
            className="bg-gradient-to-r from-green-500 via-green-200 to-green-500 hover:from-green-600 hover:to-green-700 text-black font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            Allow Location
          </button>
        </div>

        {accessLocation && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-2">Specify Search Distance (in meters)</label>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                value={maxDist}
                onChange={(e) => setMaxDist(Number(e.target.value))}
                className="w-1/2 border border-gray-900 rounded-lg p-2 bg-white"
                placeholder="e.g., 1000"
              />
              <button
                onClick={fetchCommunity}
                className="bg-gradient-to-r from-green-500 via-green-200 to-green-500 hover:from-green-600 hover:to-green-700 text-black font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
              >
                Fetch Communities
              </button>
            </div>
          </div>
        )}

        {hasFetched && (
          <>
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCommunities.map((community) => (
                  <div
                    key={community._id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl transition"
                  >
                    <h2 className="text-lg font-semibold mb-2 text-green-700">{community.communityName}</h2>
                    <p className="text-sm text-gray-600 mb-4">{community.description}</p>
                    <button
                      onClick={() => community._id && joinCommunity(community._id)}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Join Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-900 text-lg mt-6">
                😔 No communities available to join nearby. Try increasing the distance or checking back later.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JoinCommunity
