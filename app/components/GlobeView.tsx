'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const START_POV = { lat: 20, lng: 0, altitude: 2.2 }

export default function GlobeView({ points, onSelectCity }: any) {
  const globeRef = useRef<any>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const pausedUntilRef = useRef<number>(0)
  const povRef = useRef({ ...START_POV })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      const rect = wrapperRef.current?.getBoundingClientRect()

      if (rect && rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        })
      }
    }

    updateSize()

    const observer = new ResizeObserver(() => updateSize())
    if (wrapperRef.current) observer.observe(wrapperRef.current)

    window.addEventListener('resize', updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  const safePoints = useMemo(() => {
    const isMobile =
      typeof window !== 'undefined' && window.innerWidth < 768

    return points.map((p: any) => ({
      ...p,
      size: isMobile ? 3 : (p.size ?? 1.2),
    }))
  }, [points])

  const pauseRotation = () => {
    pausedUntilRef.current = Date.now() + 3000
  }

  const resetView = () => {
    povRef.current = { ...START_POV }
    globeRef.current?.pointOfView?.(povRef.current, 800)
    pauseRotation()
  }

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return
    if (!globeRef.current) return

    globeRef.current.pointOfView?.(START_POV, 0)

    const animate = () => {
      const now = Date.now()

      if (now >= pausedUntilRef.current && globeRef.current?.pointOfView) {
        povRef.current = {
          ...povRef.current,
          lng: povRef.current.lng + 0.12,
        }

        globeRef.current.pointOfView(povRef.current, 0)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions.width, dimensions.height])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div ref={wrapperRef} className="relative h-full w-full overflow-hidden">
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
          if (pov) povRef.current = pov
          pauseRotation()
        }}
        onPointClick={(point: any) => {
          pauseRotation()
          onSelectCity(point)
        }}
      />
    </div>
  )
}