"use client";

import { useMemo, useState } from "react";
import GlobeView from "./GlobeView";
import CityPanelSupabase from "./CityPanelSupabase";
import { Location } from "../lib/types";

type ClientHomeSupabaseProps = {
  locations: Location[];
};

export default function ClientHomeSupabase({
  locations,
}: ClientHomeSupabaseProps) {
  const [selectedCityName, setSelectedCityName] = useState<string>("");

  const selectedLocation = useMemo(() => {
    return (
      locations.find((location) => location.city === selectedCityName) ?? null
    );
  }, [locations, selectedCityName]);

  return (
    <main className="h-screen w-screen bg-black text-white flex">
      <GlobeView
        locations={locations}
        onSelectCity={(cityName) => setSelectedCityName(cityName)}
      />
      <CityPanelSupabase location={selectedLocation} />
    </main>
  );
}