'use client';
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plant } from "@/types/plant";

export default function AddPlantForm() {
  const { status, data: session } = useSession();
  const [plant, setPlant] = useState<Partial<Plant>>({
    name: '',
    age: 0,
    position: 'Indoor',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const bg = document.querySelector('.parallax-bg') as HTMLElement;
      if (bg) {
        bg.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlant(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/plants?userId=${session?.user?.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plant),
    });

    if (res.ok) {
      setPlant({
        name: '',
        age: 0,
        position: 'Indoor',
      });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Parallax Background */}
      <div
        className="parallax-bg absolute  parallax-bg inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/backgroundImages/mainImg.jpeg')" }}

      ></div>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10"></div>

      {/* Form Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-white/20"
        >
          <h2 className="text-3xl md:text-3xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
            🌿 Add Your Plant
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plant Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                name="name"
                placeholder="Plant Name (e.g., Monstera)"
                value={plant.name}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                required
              />
            </motion.div>

            {/* Position Select */}
            <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3 }}
>
  <select
    name="position"
    value={plant.position}
    onChange={handleChange}
    className="w-full px-5 py-3 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 appearance-none bg-[url('/images/chevron-down.svg')] bg-no-repeat bg-right bg-[length:20px]"
  >
    <option value="Indoor">Indoor</option>
    <option value="Garden">Garden</option>
    <option value="Terrace">Terrace</option>
    <option value="Balcony">Balcony</option>
  </select>
</motion.div>

            {/* Age Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                name="age"
                type="number"
                placeholder="Age of Plant (in months)"
                value={plant.age}
                onChange={handleChange}
                min="0"
                className="w-full px-5 py-3 rounded-xl bg-white text-black  placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 via-green-200 to-green-500 hover:from-green-600 hover:to-emerald-700 text-black font-semibold shadow-lg transition-all duration-300"
            >
              Add Plant 🌱
            </motion.button>
          </form>

          {/* Success Animation */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mt-6 text-center text-green-300 font-semibold"
              >
                🌿 Plant added successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}