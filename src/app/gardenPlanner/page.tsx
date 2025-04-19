"use client"
import { GetServerSideProps } from "next";
import PlantGrid from "@/components/PlantGrid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plant } from "@/types/Plant";

const plantAdjacency: Record<string, string[]> = {
  a: ["b"],
  b: ["d"],
  c: ["e", "f"],
  g: ["c"],
  p: ["m"],
  q: ["n"],
  r: ["o", "q"],
  h: ["o", "q"],
  j: ["t","w","y","n","f","l","k"],
  tomato:[""]
};

const getCompanionGroups = (adjList: Record<string, string[]>): string[][] => {
  const visited = new Set<string>();
  const groups: string[][] = [];

  const dfs = (plant: string, group: string[]) => {
    if (visited.has(plant)) return;
    visited.add(plant);
    group.push(plant);
    for (const neighbor of adjList[plant] || []) {
      dfs(neighbor, group);
    }
    // for (const key in adjList) {
    //   if (adjList[key].includes(plant)) {
    //     dfs(key, group);
    //   }
    // }
  };

  for (const plant in adjList) {
    if (!visited.has(plant)) {
      const group: string[] = [];
      dfs(plant, group);
      groups.push(group);
    }
  }

  return groups;
};

export default function gardenplannerpage() {
  const [groups, setGroups]= useState<string[][]>([]);
  const {status, data: session} = useSession();
  
    const handleSubmit = async() => {
      const res = await fetch(`/api/plants?userId=${session?.user?.id}`);
          const data = await res.json();
          console.log(data)

          const userPlants = data.map((item : Plant) => {
            console.log("Item name", item.name)
            return item.name;
          });
          console.log(userPlants)

          const res1 = await fetch('/api/parse',{
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(userPlants)
          })

          const data1 = await res1.json();
          console.log(data1)
          setGroups(() => getCompanionGroups(data1));
          console.log("groups: ", groups)
        };
    
  
  return (
    <div className="relative">
      <button
      className="absolute z-100 cursor-pointer p-4 bg-green-700 rounded-lg m-4 text-white w-24 hover:bg-green-500"
      onClick={handleSubmit}
      >Fetch</button>
      {
         groups && <PlantGrid groups={groups} /> 
      }
    </div>
  );
}