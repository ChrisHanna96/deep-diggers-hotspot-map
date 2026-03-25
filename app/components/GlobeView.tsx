"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeView() {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 });

    let animationFrameId: number;
    let lng = 0;

    const rotate = () => {
      lng += 0.15;
      globe.pointOfView({ lat: 20, lng, altitude: 2.2 }, 0);
      animationFrameId = requestAnimationFrame(rotate);
    };

    animationFrameId = requestAnimationFrame(rotate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex-1 h-screen overflow-hidden border-r border-gray-800">
      <Globe
        ref={globeRef}
        width={900}
        height={900}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#000000"
      />
    </div>
  );
}