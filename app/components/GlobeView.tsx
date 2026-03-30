'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const START_POV = { lat: 20, lng: 0, altitude: 2.2 }
const MOBILE_BREAKPOINT = 768
const ZOOM_ALTITUDE = 1.2
const ZOOM_DURATION_MS = 900
const RESUME_DELAY_MS = 3000
const RETURN_DURATION_MS = 800

export default function GlobeView({ points, onSelectCity }: any) {
  const globeRef = useRef<any>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const updateFrameRef = useRef<number | null>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null)

  useEffect(() => {
    function updateSize() {
      const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT

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

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT

  const safePoints = useMemo(() => {
    return points.map((p: any) => {
      const pointId = String(p.id)
      const isHovered = !isMobile && hoveredPointId === pointId

      return {
        ...p,
        size: isHovered
          ? (isMobile ? 1.3 : 1.7)
          : (isMobile ? 1.3 : (p.size ?? 1.2)),
      }
    })
  }, [points, hoveredPointId, isMobile])

  const enableAutoRotate = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return false

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    return true
  }

  const disableAutoRotate = () => {
    const controls = globeRef.current?.controls?.()
    if (!controls) return
    controls.autoRotate = false
  }

  const clearTimers = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }

    if (returnTimerRef.current) {
      clearTimeout(returnTimerRef.current)
      returnTimerRef.current = null
    }
  }

  const pauseAndResume = () => {
    disableAutoRotate()
    clearTimers()

    resumeTimerRef.current = setTimeout(() => {
      if (!globeRef.current) return

      globeRef.current.pointOfView(START_POV, RETURN_DURATION_MS)

      returnTimerRef.current = setTimeout(() => {
        enableAutoRotate()
      }, RETURN_DURATION_MS)
    }, RESUME_DELAY_MS)
  }

  const resetView = () => {
    if (!globeRef.current) return
    globeRef.current.pointOfView(START_POV, RETURN_DURATION_MS)
    pauseAndResume()
  }

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const startWhenReady = () => {
      const controls = globeRef.current?.controls?.()
      const canvas = globeRef.current?.renderer?.()?.domElement

      if (!controls || !canvas) return

      if (startPollRef.current) {
        clearInterval(startPollRef.current)
        startPollRef.current = null
      }

      globeRef.current.pointOfView?.(START_POV, 0)
      enableAutoRotate()

      const tick = () => {
        controls.update()
        updateFrameRef.current = requestAnimationFrame(tick)
      }

      updateFrameRef.current = requestAnimationFrame(tick)

      const handlePointerDown = () => disableAutoRotate()
      const handlePointerUp = () => pauseAndResume()
      const handleTouchStart = () => disableAutoRotate()
      const handleTouchEnd = () => pauseAndResume()
      const handleWheel = () => pauseAndResume()

      canvas.addEventListener('pointerdown', handlePointerDown, { passive: true })
      canvas.addEventListener('pointerup', handlePointerUp, { passive: true })
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
      canvas.addEventListener('touchend', handleTouchEnd, { passive: true })
      canvas.addEventListener('wheel', handleWheel, { passive: true })

      ;(globeRef.current as any).__cleanupAutorotate = () => {
        canvas.removeEventListener('pointerdown', handlePointerDown)
        canvas.removeEventListener('pointerup', handlePointerUp)
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchend', handleTouchEnd)
        canvas.removeEventListener('wheel', handleWheel)
      }
    }

    startPollRef.current = setInterval(startWhenReady, 200)
    startWhenReady()

    return () => {
      clearTimers()
      if (startPollRef.current) clearInterval(startPollRef.current)
      if (updateFrameRef.current) cancelAnimationFrame(updateFrameRef.current)
      globeRef.current?.__cleanupAutorotate?.()
    }
  }, [dimensions.width, dimensions.height])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div className="relative h-full w-full overflow-hidden">
      <button
        type="button"
        onClick={resetView}
        className="absolute right-4 top-4 z-20 rounded-lg border border-teal-700/30 bg-teal-900/10 px-3 py-1.5 text-xs font-medium text-teal-200 transition hover:bg-teal-900/20"
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
        pointColor={(point: any) =>
          !isMobile && hoveredPointId === String(point.id) ? '#99f6e4' : '#5eead4'
        }
        pointsMerge={false}
        onPointHover={(point: any | null) => {
          if (isMobile) return
          setHoveredPointId(point ? String(point.id) : null)
        }}
        onPointClick={(point: any) => {
          if (globeRef.current) {
            globeRef.current.pointOfView(
              {
                lat: Number(point.lat),
                lng: Number(point.lng),
                altitude: ZOOM_ALTITUDE,
              },
              ZOOM_DURATION_MS
            )
          }

          pauseAndResume()
          onSelectCity(point)
        }}
      />
    </div>
  )
}