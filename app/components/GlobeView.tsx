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

  const safePoints = useMemo(
    () =>
      points.map((p: any) => ({
        ...p,
        size: p.size ?? 1.2,
      })),
    [points]
  )

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

    const globeEl = globeRef.current.renderer?.()?.domElement
    if (!globeEl) return

    globeEl.addEventListener('pointerdown', pauseAndResume)
    globeEl.addEventListener('touchstart', pauseAndResume, { passive: true })

    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }
      globeEl.removeEventListener('pointerdown', pauseAndResume)
      globeEl.removeEventListener('touchstart', pauseAndResume)
    }
  }, [dimensions.width, dimensions.height])

  if (dimensions.width === 0 || dimensions.height === 0) return null

  return (
    <div className="h-full w-full overflow-hidden">
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