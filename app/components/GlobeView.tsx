'use client'

import dynamic from 'next/dynamic'
import { useMemo, useEffect, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

export default function GlobeView({ points, onSelectCity }: any) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateSize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const safePoints = useMemo(
    () =>
      points.map((p: any) => ({
        ...p,
        size: 0.8,
      })),
    [points]
  )

  if (dimensions.width === 0) return null

  return (
    <div className="h-full w-full">
      <Globe
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#111827"
        waitForGlobeReady={false}
        showAtmosphere={true}
        showGraticules={true}
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.03}
        pointRadius="size"
        pointsMerge={false}
        onPointClick={(point: any) => onSelectCity(point)}
      />
    </div>
  )
}