"use client";

import dynamic from "next/dynamic";
import { Location } from "../lib/types";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type GlobeViewProps = {
  locations: Location[];
  onSelectCity: (cityName: string) => void;
};

export default function GlobeView({ locations, onSelectCity }: GlobeViewProps) {
  const points = locations.map((location) => ({
    lat: location.latitude,
    lng: location.longitude,
    size: location.tier === 1 ? 0.35 : 0.25,
    city: location.city,
  }));

  return (
    <div className="flex-1 h-screen overflow-hidden border-r border-gray-800">
      <Globe
        width={900}
        height={900}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#000000"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"
        pointColor={() => "#4C8C8A"}
        pointLabel={(d: any) => d.city}
        onPointClick={(d: any) => onSelectCity(d.city)}
      />
    </div>
  );
}