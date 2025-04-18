"use client";
import { useEffect, useRef } from "react";

// Leaf SVG with better curves and realistic style
const LeafSVG = ({ className = "", style = {}, parallaxSpeed = 0.3 }) => {
  const leafRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (leafRef.current) {
        leafRef.current.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallaxSpeed]);

  return (
    <svg
      ref={leafRef}
      className={`absolute w-auto h-auto max-w-[200px] ${className}`}
      style={style}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 2C20 10 4 32 24 60C48 60 64 36 32 2Z"
        fill="url(#leafGradient)"
        stroke="#2E7D32"
        strokeWidth="1.5"
        className="drop-shadow-xl transition-all duration-300 hover:scale-105"
      />
      <defs>
        <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8E6CF" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Flower SVG with petal design
const FlowerSVG = ({ className = "", style = {}, parallaxSpeed = 0.3 }) => {
  const flowerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (flowerRef.current) {
        flowerRef.current.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallaxSpeed]);

  return (
    <svg
      ref={flowerRef}
      className={`absolute w-auto h-auto max-w-[180px] ${className}`}
      style={style}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEBEE" />
          <stop offset="100%" stopColor="#E91E63" />
        </radialGradient>
      </defs>
      <g className="drop-shadow-lg">
        <circle cx="50" cy="50" r="10" fill="#FFD700" />
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <ellipse
              key={i}
              cx="50"
              cy="30"
              rx="8"
              ry="20"
              fill="url(#petalGradient)"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}
      </g>
    </svg>
  );
};

// Main layout with enhanced visual background
export default function PlantBackground() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-100 to-green-200 overflow-hidden">
      {/* Leaf layers */}
      <LeafSVG className="top-10 left-10 opacity-60 rotate-[15deg]" parallaxSpeed={0.2} />
      <LeafSVG className="top-20 right-10 opacity-70 -rotate-[10deg]" parallaxSpeed={0.35} />
      <LeafSVG className="bottom-16 left-1/2 -translate-x-1/2 opacity-50 rotate-[45deg]" parallaxSpeed={0.25} />
      <LeafSVG className="top-1/2 left-5 opacity-50 rotate-[30deg]" parallaxSpeed={0.2} />
      <LeafSVG className="bottom-20 right-10 opacity-55 -rotate-[25deg]" parallaxSpeed={0.3} />

      {/* Flowers */}
      <FlowerSVG className="top-40 left-20 opacity-75 scale-90" parallaxSpeed={0.28} />
      <FlowerSVG className="bottom-32 right-1/4 opacity-65 scale-95" parallaxSpeed={0.32} />
      <FlowerSVG className="top-56 right-10 opacity-85 scale-105" parallaxSpeed={0.24} />

      {/* Content area */}
      <div className="relative z-10 p-10 text-center text-green-900 font-poppins">
        <h1 className="text-5xl font-bold mb-4">Welcome to Your Nature Space 🌿</h1>
        <p className="text-xl">Feel the calm, breathe the green, live the leaf.</p>
      </div>

      {/* Global font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}
