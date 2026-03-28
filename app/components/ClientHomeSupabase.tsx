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
        size: 0.45,
        location,
      })),
    [locations]
  )

  return (
    <main className="h-screen w-screen bg-black text-white md:flex">
      <section className="relative h-[55vh] w-full md:h-full md:w-[58%]">
        <GlobeView
          points={points}
          onSelectCity={(point) => {
            const hotspot = point as Hotspot
            setSelectedLocation(hotspot.location)
          }}
        />
      </section>

      <section className="h-[45vh] w-full border-t border-gray-800 md:h-full md:w-[42%] md:border-l md:border-t-0">
        <CityPanelSupabase location={selectedLocation} />
      </section>
    </main>
  )
}