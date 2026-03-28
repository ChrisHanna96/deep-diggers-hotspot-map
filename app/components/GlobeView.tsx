'use client'

import Globe from 'react-globe.gl'
import { useMemo, useRef } from 'react'

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

  const safePoints = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        size: p.size ?? 0.9
      })),
    [points]
  )

  return (
    <div
      className="relative h-full w-full"
      style={{ touchAction: 'none' }}
    >
      <div className="pointer-events-none absolute inset-0 z-10" />

      <Globe
        ref={globeRef}
        width={undefined}
        height={undefined}
        globeImageUrl="/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        enablePointerInteraction={true}
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointLabel="city"
        pointAltitude={0.04}
        pointRadius="size"
        pointResolution={18}
        pointsMerge={false}
        onPointClick={(point) => {
          const cityPoint = point as Hotspot
          alert(`Selected: ${cityPoint.city}`)
          onSelectCity(cityPoint)
        }}
      />
    </div>
  )
}