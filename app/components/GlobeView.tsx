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

  const enableAutoRotate = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.update?.()
  }

  const pauseAndResume = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return

    controls.autoRotate = false
    controls.update?.()

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }

    resumeTimerRef.current = setTimeout(() => {
      enableAutoRotate()
    }, 3000)
  }

  const resetView = () => {
    if (!globeRef.current) return

    globeRef.current.pointOfView(
      { lat: 20, lng: 0, altitude: 2.2 },
      800
    )

    pauseAndResume()
  }

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return
    if (!globeRef.current) return

    const setupTimer = setTimeout(() => {
      enableAutoRotate()

      const controls = globeRef.current?.controls?.()
      controls?.update?.()

      const canvas = globeRef.current?.renderer?.()?.domElement
      if (!canvas) return

      const handleInteractionEnd = () => {
        pauseAndResume()
      }

      canvas.addEventListener('pointerup', handleInteractionEnd)
      canvas.addEventListener('touchend', handleInteractionEnd, { passive: true })
      canvas.addEventListener('wheel', handleInteractionEnd, { passive: true })

      ;(globeRef.current as any).__cleanupInteractionHandlers = () => {
        canvas.removeEventListener('pointerup', handleInteractionEnd)
        canvas.removeEventListener('touchend', handleInteractionEnd)
        canvas.removeEventListener('wheel', handleInteractionEnd)
      }
    }, 400)

    return () => {
      clearTimeout(setupTimer)

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }

      globeRef.current?.__cleanupInteractionHandlers?.()
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
        onPointClick={(point: any) => {
          pauseAndResume()
          onSelectCity(point)
        }}
      />
    </div>
  )
}