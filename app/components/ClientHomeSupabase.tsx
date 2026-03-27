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
    <main className="h-screen w-screen bg-black text-white flex flex-col md:flex-row">
      <div className="relative h-[65vh] w-full md:h-screen md:w-[68%]">
        <GlobeView
          locations={locations}
          onSelectCity={(cityName) => setSelectedCityName(cityName)}
        />
      </div>

      <div className="h-[35vh] w-full border-t border-gray-800 md:h-screen md:w-[32%] md:border-t-0 md:border-l">
        <CityPanelSupabase location={selectedLocation} />
      </div>
    </main>
  );
}