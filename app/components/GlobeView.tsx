'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const START_POV = { lat: 20, lng: 0, altitude: 2.2 }

export default function GlobeView({ points, onSelectCity }: any) {
  const globeRef = useRef<any>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rotationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pauseUntilRef = useRef<number>(0)
  const povRef = useRef({ ...START_POV })

  const pointerActiveRef = useRef(false)
  const touchActiveRef = useRef(false)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [globeReady, setGlobeReady] = useState(false)
  const [debug, setDebug] = useState({
    effectRuns: 0,
    ticks: 0,
    pauses: 0,
    globeReadyCount: 0,
    lng: 0,
    paused: false,
  })

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
      size: isMobile ? 1.3 : (p.size ?? 1.2),
    }))
  }, [points])

  const pauseAndResume = (source = 'unknown') => {
    pauseUntilRef.current = Date.now() + 3000

    setDebug((prev) => ({
      ...prev,
      pauses: prev.pauses + 1,
      paused: true,
    }))

    console.log('[Globe debug] pauseAndResume', source, {
      pauseUntil: pauseUntilRef.current,
    })

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }

    resumeTimerRef.current = setTimeout(() => {
      pauseUntilRef.current = 0
      setDebug((prev) => ({
        ...prev,
        paused: false,
      }))
      console.log('[Globe debug] resume')
    }, 3000)
  }

  const resetView = () => {
    if (!globeRef.current) return

    povRef.current = { ...START_POV }
    globeRef.current.pointOfView(START_POV, 800)
    pauseAndResume('resetView')
  }

  useEffect(() => {
    if (!globeReady) return
    if (dimensions.width === 0 || dimensions.height === 0) return
    if (!globeRef.current) return

    setDebug((prev) => ({
      ...prev,
      effectRuns: prev.effectRuns + 1,
    }))

    console.log('[Globe debug] effect start', {
      globeReady,
      width: dimensions.width,
      height: dimensions.height,
    })

    globeRef.current.pointOfView(START_POV, 0)
    povRef.current = { ...START_POV }
    pauseUntilRef.current = 0
    pointerActiveRef.current = false
    touchActiveRef.current = false

    const canvas = globeRef.current?.renderer?.()?.domElement

    const handlePointerDown = () => {
      pointerActiveRef.current = true
      console.log('[Globe debug] pointerdown')
    }

    const handlePointerUp = () => {
      console.log('[Globe debug] pointerup', { active: pointerActiveRef.current })
      if (pointerActiveRef.current) {
        pointerActiveRef.current = false
        pauseAndResume('pointerup')
      }
    }

    const handleTouchStart = () => {
      touchActiveRef.current = true
      console.log('[Globe debug] touchstart')
    }

    const handleTouchEnd = () => {
      console.log('[Globe debug] touchend', { active: touchActiveRef.current })
      if (touchActiveRef.current) {
        touchActiveRef.current = false
        pauseAndResume('touchend')
      }
    }

    const handleWheel = () => {
      console.log('[Globe debug] wheel')
      pauseAndResume('wheel')
    }

    if (canvas) {
      canvas.addEventListener('pointerdown', handlePointerDown, { passive: true })
      canvas.addEventListener('pointerup', handlePointerUp, { passive: true })
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
      canvas.addEventListener('touchend', handleTouchEnd, { passive: true })
      canvas.addEventListener('wheel', handleWheel, { passive: true })
    }

    rotationIntervalRef.current = setInterval(() => {
      const now = Date.now()

      if (now >= pauseUntilRef.current && globeRef.current?.pointOfView) {
        povRef.current = {
          ...povRef.current,
          lng: povRef.current.lng + 0.08,
        }

        globeRef.current.pointOfView(povRef.current, 0)

        setDebug((prev) => ({
          ...prev,
          ticks: prev.ticks + 1,
          lng: Number(povRef.current.lng.toFixed(2)),
        }))
      }
    }, 40)

    return () => {
      console.log('[Globe debug] effect cleanup')

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }

      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }

      if (canvas) {
        canvas.removeEventListener('pointerdown', handlePointerDown)
        canvas.removeEventListener('pointerup', handlePointerUp)
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchend', handleTouchEnd)
        canvas.removeEventListener('wheel', handleWheel)
      }
    }
  }, [globeReady, dimensions.width, dimensions.height])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-30 rounded-xl border border-red-500/40 bg-black/80 px-3 py-2 text-xs text-white">
        <div>ready: {globeReady ? 'yes' : 'no'}</div>
        <div>effectRuns: {debug.effectRuns}</div>
        <div>globeReadyCount: {debug.globeReadyCount}</div>
        <div>ticks: {debug.ticks}</div>
        <div>pauses: {debug.pauses}</div>
        <div>paused: {debug.paused ? 'yes' : 'no'}</div>
        <div>lng: {debug.lng}</div>
      </div>

      <button
        type="button"
        onClick={resetView}
        className="absolute left-4 top-32 z-20 rounded-xl border border-teal-700/40 bg-teal-900/20 px-3 py-2 text-sm font-medium text-teal-200 transition hover:bg-teal-900/30"
      >
        Reset View
      </button>

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#111827"
        waitForGlobeReady={false}
        animateIn={false}
        showAtmosphere={true}
        showGraticules={true}
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.03}
        pointRadius="size"
        pointColor={() => '#5eead4'}
        pointsMerge={false}
        onGlobeReady={() => {
          console.log('[Globe debug] onGlobeReady')
          setGlobeReady(true)
          setDebug((prev) => ({
            ...prev,
            globeReadyCount: prev.globeReadyCount + 1,
          }))
        }}
        onPointClick={(point: any) => {
          pauseAndResume('pointClick')
          onSelectCity(point)
        }}
      />
    </div>
  )
}