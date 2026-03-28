'use client'

import Globe from 'react-globe.gl'
import { useRef, useMemo, useState } from 'react'

type Hotspot = {
  id: string
  city: string
  lat: number
  lng: number
  size?: number
}

type GlobeViewProps = {
  points: Hotspot[]
  onSelectCity: (point: Hotspot) => void
}

export default function GlobeView({ points, onSelectCity }: GlobeViewProps) {
  const globeRef = useRef<any>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  // Ensure every point has a visible/tappable size
  const safePoints = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        size: p.size ?? 0.35
      })),
    [points]
  )

  return (
    <div
      className="relative w-full h-full"
      style={{ touchAction: 'none' }}
    >
      {/* NON-INTERACTIVE OVERLAY (SAFE) */}
      <div className="pointer-events-none absolute inset-0 z-10" />

      <Globe
        ref={globeRef}

        // sizing
        width={undefined}
        height={undefined}

        // visuals
        globeImageUrl="/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"

        // DATA
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"

        // CRITICAL: must be FALSE or clicks/taps will NOT work
        pointsMerge={false}

        // INTERACTION
        onPointClick={(point) => {
          onSelectCity(point as Hotspot)
        }}

        // OPTIONAL: interaction state tracking (safe)
        onZoom={() => setIsInteracting(true)}
        onRotate={() => setIsInteracting(true)}
        onRotateEnd={() => setIsInteracting(false)}
      />
    </div>
  )
}