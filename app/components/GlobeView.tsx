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
        size: p.size ?? 0.45
      })),
    [points]
  )

  return (
    <div className="relative h-full w-full">
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
        pointAltitude={0.02}
        pointRadius="size"
        pointsMerge={false}
        pointColor={() => '#d1d5db'}
        htmlElementsData={safePoints}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.03}
        htmlElement={(point) => {
          const cityPoint = point as Hotspot

          const el = document.createElement('button')
          el.type = 'button'
          el.setAttribute('aria-label', cityPoint.city)
          el.title = cityPoint.city

          el.style.width = '28px'
          el.style.height = '28px'
          el.style.borderRadius = '9999px'
          el.style.border = '2px solid rgba(255,255,255,0.95)'
          el.style.background = 'rgba(255,255,255,0.18)'
          el.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.35)'
          el.style.cursor = 'pointer'
          el.style.pointerEvents = 'auto'
          el.style.touchAction = 'manipulation'
          el.style.webkitTapHighlightColor = 'transparent'
          el.style.display = 'block'

          const handleSelect = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            onSelectCity(cityPoint)
          }

          el.addEventListener('click', handleSelect)
          el.addEventListener('touchend', handleSelect)

          return el
        }}
      />
    </div>
  )
}