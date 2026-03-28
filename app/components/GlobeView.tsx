cat > app/components/GlobeView.tsx <<'EOF'
'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

export default function GlobeView({ points, onSelectCity }: any) {
  const safePoints = useMemo(
    () =>
      points.map((p: any) => ({
        ...p,
        size: 0.6,
      })),
    [points]
  )

  return (
    <div className="relative h-full w-full" style={{ touchAction: 'none' }}>
      <Globe
        width={undefined}
        height={undefined}
        globeImageUrl="/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={safePoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"
        pointsMerge={false}
        onPointClick={(point: any) => onSelectCity(point)}
      />
    </div>
  )
}
EOF