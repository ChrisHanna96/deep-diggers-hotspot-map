'use client'

import { useMemo, useState } from 'react'
import GlobeView from './GlobeView'
import CityPanelSupabase from './CityPanelSupabase'
import type { Location } from '../lib/types'

type Hotspot = {
  id: string
  city: string
  lat: number
  lng: number
  size?: number
  location: Location
}

type ClientHomeSupabaseProps = {
  locations: Location[]
}

export default function ClientHomeSupabase({
  locations,
}: ClientHomeSupabaseProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const points: Hotspot[] = useMemo(
    () =>
      locations.map((location) => ({
        id: location.id,
        city: location.city,
        lat: location.latitude,
        lng: location.longitude,
        size: 1.2,
        location,
      })),
    [locations]
  )

  return (
    <main className="flex h-[100dvh] w-screen flex-col bg-black text-white md:h-screen md:flex-row">
      <section className="relative z-0 h-[55dvh] w-full overflow-hidden pt-20 md:h-full md:w-[58%] md:pt-24">
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 px-4 py-3 text-sm text-gray-300 md:px-6 md:py-4">
          Drag or move the globe to explore scenes. Select cities to open scene details, key figures, mixes and digging routes. You can also zoom in.
        </div>

        <GlobeView
          points={points}
          onSelectCity={(point: any) => {
            const hotspot = point as Hotspot
            setSelectedLocation(hotspot.location)
          }}
        />
      </section>

      <section className="relative z-20 h-[45dvh] w-full overflow-hidden bg-[#12161B] md:h-full md:w-[42%] md:border-l md:border-gray-800">
        <CityPanelSupabase location={selectedLocation} />
      </section>
    </main>
  )
}