"use client";

import { useState } from "react";
import GlobeView from "./components/GlobeView";
import CityPanel from "./components/CityPanel";
import { chicago } from "./lib/chicago";
import { detroit } from "./lib/detroit";
import { bucharest } from "./lib/bucharest";

const cities = {
  chicago,
  detroit,
  bucharest,
};

type CityKey = keyof typeof cities;

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<CityKey>("chicago");

  return (
    <main className="h-screen w-screen bg-black text-white flex">
     <GlobeView />
      <CityPanel city={cities[selectedCity]} />
    </main>
  );
}