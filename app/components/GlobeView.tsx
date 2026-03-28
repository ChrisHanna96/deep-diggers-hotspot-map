'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

export default function GlobeView({ points, onSelectCity }: any) {
  const globeRef = useRef<any>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateSize() {
      const isDesktop = window.innerWidth >= 768

      setDimensions({
        width: isDesktop
          ? Math.floor(window.innerWidth * 0.58)
          : window.innerWidth,
        height: isDesktop
          ? window.innerHeight
          : Math.floor(window.innerHeight * 0.55),
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const safePoints = useMemo(() => {
    const isMobile =
      typeof window !== 'undefined' && window.innerWidth < 768

    return points.map((p: any) => ({
      ...p,
      size: isMobile ? 2.5 : (p.size ?? 1.2),
    }))
  }, [points])

  const pauseAndResume = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return

    controls.autoRotate = false

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }

    resumeTimerRef.current = setTimeout(() => {
      controls.autoRotate = true
    }, 3000)
  }

  const enableAutoRotate = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
  }

  useEffect(() => {
    if (!globeRef.current) return

    const timer = setTimeout(() => {
      enableAutoRotate()
    }, 800) // critical delay for stability

    return () => clearTimeout(timer)
  }, [dimensions.width])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#111827"
        globeImageUrl="/earth-night.jpg"
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"
        pointColor={() => '#5eead4'}
        onPointClick={(point: any) => {
          pauseAndResume()
          onSelectCity(point)
        }}
        onZoom={pauseAndResume}
      />
    </div>
  )
}