'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const START_POV = { lat: 20, lng: 0, altitude: 2.2 }

export default function GlobeView({ points, onSelectCity }: any) {
  const globeRef = useRef<any>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rotationFrameRef = useRef<number | null>(null)
  const pauseUntilRef = useRef<number>(0)
  const povRef = useRef({ ...START_POV })

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
      size: isMobile ? 2.8 : (p.size ?? 1.2),
    }))
  }, [points])

  const pauseAndResume = () => {
    pauseUntilRef.current = Date.now() + 3000

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }

    resumeTimerRef.current = setTimeout(() => {
      pauseUntilRef.current = 0
    }, 3000)
  }

  const resetView = () => {
    if (!globeRef.current) return

    povRef.current = { ...START_POV }
    globeRef.current.pointOfView(START_POV, 800)
    pauseAndResume()
  }

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return
    if (!globeRef.current) return

    globeRef.current.pointOfView(START_POV, 0)
    povRef.current = { ...START_POV }

    const rotate = () => {
      const now = Date.now()

      if (now >= pauseUntilRef.current && globeRef.current?.pointOfView) {
        povRef.current = {
          ...povRef.current,
          lng: povRef.current.lng + 0.08,
        }

        globeRef.current.pointOfView(povRef.current, 0)
      }

      rotationFrameRef.current = requestAnimationFrame(rotate)
    }

    rotationFrameRef.current = requestAnimationFrame(rotate)

    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }

      if (rotationFrameRef.current) {
        cancelAnimationFrame(rotationFrameRef.current)
      }
    }
  }, [dimensions.width, dimensions.height])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div className="relative h-full w-full overflow-hidden">
      <button
        type="button"
        onClick={resetView}
        className="absolute left-4 top-4 z-20 rounded-xl border border-teal-700/40 bg-teal-900/20 px-3 py-2 text-sm font-medium text-teal-200 transition hover:bg-teal-900/30"
      >
        Reset View
      </button>

      <Globe
        ref={globeRef}
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
        pointColor={() => '#5eead4'}
        pointsMerge={false}
        onZoom={(pov: any) => {
          if (pov) {
            povRef.current = pov
          }
          pauseAndResume()
        }}
        onPointClick={(point: any) => {
          pauseAndResume()
          onSelectCity(point)
        }}
      />
    </div>
  )
}