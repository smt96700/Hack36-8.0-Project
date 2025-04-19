import React from "react";
import { Leaf, Flower, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import bgImage from "../../public/backgroundImages/plantImg2.jpg";

type Props = {
  groups: string[][];
};

const plantIcons: Record<number, React.ReactNode> = {
  0: <Leaf className="h-5 w-5" />,
  1: <Flower className="h-5 w-5" />,
  2: <Sprout className="h-5 w-5" />,
};

const groupColors = [
  "bg-emerald-100 text-emerald-800 border-emerald-300",
  "bg-amber-100 text-amber-800 border-amber-300",
  "bg-sky-100 text-sky-800 border-sky-300",
  "bg-rose-100 text-rose-800 border-rose-300",
  "bg-violet-100 text-violet-800 border-violet-300",
  "bg-lime-100 text-lime-800 border-lime-300",
];

const PlantGrid: React.FC<Props> = ({ groups }) => {
  return (
    <div className="relative p-6 overflow-auto min-h-screen w-full">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 z-0" />
      <div className="absolute inset-0 bg-[url('/backgroundImages/plantImg2.jpg')] bg-cover opacity-80 bg-center z-0" />

      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-100/30 to-transparent z-0" />

      <div className="relative z-10 mb-8">
        <h1 className="text-3xl font-bold text-black text-center mb-2 drop-shadow-lg">
          Sustainable Garden Companion Planting
        </h1>
        <p className="text-black text-center text-lg max-w-2xl mx-auto drop-shadow-md">
          Companion plants work together to create a balanced, eco-friendly ecosystem.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-6 items-center">
        {groups.map((group, groupIndex) => {
          const colorClass = groupColors[groupIndex % groupColors.length];
          const icon = plantIcons[groupIndex % Object.keys(plantIcons).length];

          return (
            <div
              key={`group-${groupIndex}`}
              className={cn(
                "w-full max-w-4xl rounded-xl border-2 shadow-lg p-4",
                colorClass
              )}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                Group {groupIndex + 1}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {group.map((plant, i) => (
                  <div
                    key={`${plant}-${i}`}
                    className="w-24 h-24 flex flex-col items-center justify-center text-center rounded-full shadow-md border-2 bg-white/50 backdrop-blur-md hover:scale-105 transition-transform"
                    title={plant}
                  >
                    <div className="mb-1">{icon}</div>
                    <div className="text-xs font-medium leading-tight px-1 truncate">
                      {plant}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlantGrid;
