"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Location } from "../lib/types";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type GlobeViewProps = {
  locations: Location[];
  onSelectCity: (cityName: string) => void;
};

export default function GlobeView({ locations, onSelectCity }: GlobeViewProps) {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    let frameId: number;
    let lng = 0;

    const rotate = () => {
      if (globeRef.current) {
        lng += 0.08;
        globeRef.current.pointOfView({ lat: 20, lng, altitude: 2.2 }, 0);
      }
      frameId = requestAnimationFrame(rotate);
    };

    rotate();

    return () => cancelAnimationFrame(frameId);
  }, []);

  const points = locations.map((location) => ({
    lat: location.latitude,
    lng: location.longitude,
    size: location.tier === 1 ? 0.6 : 0.4,
    city: location.city,
  }));

  return (
    <div className="relative flex-1 h-screen overflow-hidden border-r border-gray-800">
      <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded bg-black/70 px-4 py-2 text-xs text-white">
        Drag the globe to explore scenes
      </div>

      <Globe
        ref={globeRef}
        width={900}
        height={900}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#000000"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"
        pointColor={() => "#5FA3A3"}
        pointLabel={(d: any) => d.city}
        onPointClick={(d: any) => onSelectCity(d.city)}
      />
    </div>
  );
}