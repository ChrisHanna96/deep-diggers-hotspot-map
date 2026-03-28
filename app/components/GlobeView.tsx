'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

export default function GlobeView({ points, onSelectCity }: any) {
  const globeRef = useRef<any>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controlsBoundRef = useRef(false)

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

  const safePoints = useMemo(
    () =>
      points.map((p: any) => ({
        ...p,
        size: p.size ?? 1.2,
      })),
    [points]
  )

  const enableAutoRotate = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.enablePan = false
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
    if (!globeRef.current || dimensions.width === 0 || dimensions.height === 0) {
      return
    }

    const bindControls = () => {
      const controls = globeRef.current?.controls?.()
      const renderer = globeRef.current?.renderer?.()
      const canvas = renderer?.domElement

      if (!controls || !canvas) return false

      enableAutoRotate()

      if (!controlsBoundRef.current) {
        canvas.addEventListener('pointerdown', pauseAndResume)
        canvas.addEventListener('wheel', pauseAndResume, { passive: true })
        canvas.addEventListener('touchstart', pauseAndResume, { passive: true })
        controlsBoundRef.current = true
      }

      return true
    }

    const immediate = bindControls()
    if (immediate) return

    const timer = setTimeout(() => {
      bindControls()
    }, 300)

    return () => clearTimeout(timer)
  }, [dimensions.width, dimensions.height])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }

      const renderer = globeRef.current?.renderer?.()
      const canvas = renderer?.domElement

      if (canvas && controlsBoundRef.current) {
        canvas.removeEventListener('pointerdown', pauseAndResume)
        canvas.removeEventListener('wheel', pauseAndResume)
        canvas.removeEventListener('touchstart', pauseAndResume)
      }
    }
  }, [])

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
        onZoom={pauseAndResume}
        onPointClick={(point: any) => {
          pauseAndResume()
          onSelectCity(point)
        }}
      />
    </div>
  )
}