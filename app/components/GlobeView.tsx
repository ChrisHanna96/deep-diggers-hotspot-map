'use client'

import Globe from 'react-globe.gl'
import { useMemo, useRef, useState } from 'react'

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

  const [hoveredPoint, setHoveredPoint] = useState<Hotspot | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const safePoints = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        size: p.size ?? 0.35
      })),
    [points]
  )

  const handleSelect = (point: Hotspot | null) => {
    if (!point) return
    alert(`Selected: ${point.city}`)
    onSelectCity(point)
  }

  return (
    <div
      className="relative h-full w-full"
      style={{ touchAction: 'none' }}
      onTouchStart={(e) => {
        const touch = e.touches[0]
        if (!touch) return
        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      }}
      onTouchEnd={(e) => {
        const start = touchStartRef.current
        const touch = e.changedTouches[0]

        if (!start || !touch) return

        const dx = Math.abs(touch.clientX - start.x)
        const dy = Math.abs(touch.clientY - start.y)

        const TAP_THRESHOLD = 12

        if (dx <= TAP_THRESHOLD && dy <= TAP_THRESHOLD && hoveredPoint) {
          handleSelect(hoveredPoint)
        }

        touchStartRef.current = null
      }}
    >
      {/* Non-interactive overlay */}
      <div className="pointer-events-none absolute inset-0 z-10" />

      <Globe
        ref={globeRef}
        width={undefined}
        height={undefined}
        globeImageUrl="/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"
        pointsMerge={false}
        onPointHover={(point) => {
          setHoveredPoint((point as Hotspot) || null)
        }}
        onPointClick={(point) => {
          handleSelect(point as Hotspot)
        }}
      />
    </div>
  )
}