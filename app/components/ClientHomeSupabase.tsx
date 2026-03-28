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
      <section className="relative z-0 h-[55dvh] w-full overflow-hidden md:h-full md:w-[58%]">
        <div className="pointer-events-none absolute left-4 right-16 top-4 z-30 md:left-6 md:right-20 md:top-5">
          <p
            className="text-sm font-semibold tracking-[0.02em] text-teal-200 md:text-base"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.55)' }}
          >
            Explore global underground scenes — drag or zoom
          </p>
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