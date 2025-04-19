'use client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';

const CreateCommunity = () => {

  const { status, data: session } = useSession();
  const [accessLocation, setAccessLocation] = useState(false);

  const [form, setForm] = useState({
    communityName: "",
    plantName: "",
    description: "",
    latitude: 0,
    longitude: 0,
  });

  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("Latitude:", pos.coords.latitude);
      console.log("Longitude:", pos.coords.longitude);
      setForm((prevForm) => ({
        ...prevForm,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));

      setAccessLocation(true);
      alert("Location Fetched Successfully");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/community/create?userId=${session?.user?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log(form);

      if (res.ok) {
        alert("Community Created Successfully");
        setForm({
          communityName: "",
          plantName: "",
          description: "",
          latitude: 0,
          longitude: 0,
        });
        setAccessLocation(false);
      } else {
        const data = await res.json();
        alert(data.message || "Error creating community");
      }
    } catch (error) {
      console.error("Failed to create Community", error);
      alert("Failed to create Community");
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white-300 flex items-center justify-center p-4 parallax-bg inset-0 bg-cover bg-center z-0" 
    style={{
      backgroundImage: "url('/backgroundImages/mainImg.jpeg')",
      willChange: 'transform',
    }}>
      <div className="w-full max-w-xl bg-white/40 backdrop-blur-sm p-6 rounded-xl shadow-lg">

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2 text-green">Allow Location to create the community</h2>
          <button
            className="border border-black  px-4 py-2xl bg-gradient-to-r from-green-500 via-green-200 to-green-500 hover:from-green-600 hover:to-emerald-700 text-black font-semibold shadow-lg transition-all duration-300 rounded-4xl py-2"
            onClick={setLocation}
          >
            Allow Location
          </button>
        </div>

        {accessLocation && (
          <>
            <h1 className="text-2xl text-white font-bold mb-6 text-center">Create a New Community 🌱</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Community Name</label>
                <input
                  type="text"
                  name="communityName"
                  value={form.communityName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 bg-white"
                  placeholder="e.g., Basil Lovers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Plant Name</label>
                <input
                  type="text"
                  name="plantName"
                  value={form.plantName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 bg-white"
                  placeholder="e.g., Basil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-lg p-2 bg-white"
                  placeholder="What is your community about?"
                />
              </div>

              <button
                type="submit"
                className="border border-black  px-4 py-2xl bg-gradient-to-r from-green-500 via-green-200 to-green-500 hover:from-green-600 hover:to-emerald-700 text-black font-semibold shadow-lg transition-all duration-300 rounded-4xl py-2 w-full"
              >
                Create Community
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateCommunity;
