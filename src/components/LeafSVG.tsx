import React from "react";

interface LeafSVGProps {
  className?: string;
  rotation?: number;
}

const LeafSVG: React.FC<LeafSVGProps> = ({ className = "", rotation = 0 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-all duration-500 hover:scale-110`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
};

export default LeafSVG;