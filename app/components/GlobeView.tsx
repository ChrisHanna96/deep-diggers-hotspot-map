'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

export default function GlobeView({ points, onSelectCity }: any) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const globeRef = useRef<any>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const safePoints = useMemo(
    () =>
      points.map((p: any) => ({
        ...p,
        size: 0.8,
      })),
    [points]
  )

  useEffect(() => {
    if (!wrapperRef.current) return

    const updateSize = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      setDimensions({
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      })
    }

    updateSize()

    const observer = new ResizeObserver(() => {
      updateSize()
    })

    observer.observe(wrapperRef.current)
    window.addEventListener('resize', updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  useEffect(() => {
    if (!globeRef.current) return

    const controls = globeRef.current.controls()
    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    const pauseAndResume = () => {
      controls.autoRotate = false

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }

      resumeTimerRef.current = setTimeout(() => {
        controls.autoRotate = true
      }, 3000)
    }

    const el = wrapperRef.current
    if (!el) return

    el.addEventListener('pointerdown', pauseAndResume)
    el.addEventListener('touchstart', pauseAndResume, { passive: true })

    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }
      el.removeEventListener('pointerdown', pauseAndResume)
      el.removeEventListener('touchstart', pauseAndResume)
    }
  }, [dimensions.width, dimensions.height])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div ref={wrapperRef} className="h-full w-full overflow-hidden">
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
        pointsMerge={false}
        onPointClick={(point: any) => onSelectCity(point)}
      />
    </div>
  )
}