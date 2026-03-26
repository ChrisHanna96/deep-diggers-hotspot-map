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
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const startRotation = () => {
      if (!globeRef.current) return;
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = true;
      controls.enablePan = false;
    };

    // slight delay so the globe instance is definitely ready
    const initTimer = setTimeout(() => {
      startRotation();
    }, 300);

    return () => {
      clearTimeout(initTimer);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseRotation = () => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = false;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const resumeRotationWithDelay = () => {
    if (!globeRef.current) return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      if (!globeRef.current) return;
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
    }, 3000);
  };

  const points = locations.map((location) => ({
    lat: location.latitude,
    lng: location.longitude,
    size: location.tier === 1 ? 0.6 : 0.4,
    city: location.city,
  }));

  return (
    <div
      className="relative flex-1 h-screen overflow-hidden border-r border-gray-800"
      onMouseDown={pauseRotation}
      onMouseUp={resumeRotationWithDelay}
      onMouseLeave={resumeRotationWithDelay}
      onTouchStart={pauseRotation}
      onTouchEnd={resumeRotationWithDelay}
    >
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