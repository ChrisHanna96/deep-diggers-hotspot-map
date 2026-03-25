"use client";

import { useState } from "react";
import GlobeView from "./GlobeView";
import CityPanel from "./CityPanel";
import { chicago } from "../lib/chicago";
import { detroit } from "../lib/detroit";
import { bucharest } from "../lib/bucharest";
import { Location } from "../lib/types";

type ClientHomeProps = {
  locations: Location[];
};

const cityDetails = {
  Chicago: chicago,
  Detroit: detroit,
  Bucharest: bucharest,
};

type CityKey = keyof typeof cityDetails;

export default function ClientHome({ locations }: ClientHomeProps) {
  const [selectedCity, setSelectedCity] = useState<CityKey>("Chicago");

  return (
    <main className="h-screen w-screen bg-black text-white flex">
      <GlobeView
        locations={locations}
        onSelectCity={(cityName) => setSelectedCity(cityName as CityKey)}
      />
      <CityPanel city={cityDetails[selectedCity]} />
    </main>
  );
}