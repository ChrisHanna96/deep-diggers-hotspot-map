"use client";

import { useEffect, useState } from "react";
import {
  getAccessPoints,
  getSceneEssentials,
  getSeminalTracks,
  getSonicIdentity,
} from "../lib/queries";
import { Location } from "../lib/types";

type SceneEssentialsRow = {
  notes: string | null;
};

type SonicIdentityRow = {
  description: string;
};

type SeminalTrackRow = {
  id: string;
  artist: string;
  track: string;
  year: number | null;
};

type AccessPointRow = {
  id: string;
  name: string;
  category: string;
};

type CityPanelSupabaseProps = {
  location: Location | null;
};

export default function CityPanelSupabase({
  location,
}: CityPanelSupabaseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sceneEssentials, setSceneEssentials] =
    useState<SceneEssentialsRow | null>(null);
  const [sonicIdentity, setSonicIdentity] =
    useState<SonicIdentityRow | null>(null);
  const [seminalTracks, setSeminalTracks] = useState<SeminalTrackRow[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPointRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCityData() {
      if (!location) return;

      setIsExpanded(false);
      setLoading(true);

      try {
        const [sceneData, sonicData, tracksData, accessData] =
          await Promise.all([
            getSceneEssentials(location.id),
            getSonicIdentity(location.id),
            getSeminalTracks(location.id),
            getAccessPoints(location.id),
          ]);

        setSceneEssentials(sceneData);
        setSonicIdentity(sonicData);
        setSeminalTracks(tracksData);
        setAccessPoints(accessData);
      } catch (error) {
        console.error("Failed to load city panel data:", error);
        setSceneEssentials(null);
        setSonicIdentity(null);
        setSeminalTracks([]);
        setAccessPoints([]);
      } finally {
        setLoading(false);
      }
    }

    loadCityData();
  }, [location]);

  if (!location) {
    return (
      <aside className="w-[420px] border-l border-gray-800 bg-[#12161B] p-6 text-white">
        <p className="text-sm text-gray-400">No city selected.</p>
      </aside>
    );
  }

  return (
    <aside className="w-[420px] border-l border-gray-800 bg-[#12161B] p-6 text-white overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{location.city}</h1>
          <p className="mt-1 text-sm text-gray-400">{location.country}</p>
          <p className="mt-3 text-sm text-gray-300">Tier {location.tier}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {location.genres.map((genre) => (
              <span
                key={genre}
                className="rounded border border-gray-700 px-2 py-1 text-xs text-gray-300"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-300">
            {location.summary}
          </p>
        </div>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full rounded border border-gray-700 px-4 py-3 text-left text-sm font-medium hover:bg-gray-800"
        >
          {isExpanded ? "Hide Scene" : "Explore Scene"}
        </button>

        {loading && (
          <p className="text-sm text-gray-400">Loading scene data...</p>
        )}

        {isExpanded && !loading && (
          <>
            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Scene Essentials
              </h2>
              <p className="text-sm leading-6 text-gray-300">
                {sceneEssentials?.notes ?? "No scene essentials available."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Sonic Identity
              </h2>
              <p className="text-sm leading-6 text-gray-300">
                {sonicIdentity?.description ?? "No sonic identity available."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Seminal Tracks
              </h2>
              <ul className="space-y-3 text-sm text-gray-300">
                {seminalTracks.length > 0 ? (
                  seminalTracks.map((track) => (
                    <li key={track.id}>
                      {track.artist} — {track.track}
                      {track.year ? ` (${track.year})` : ""}
                    </li>
                  ))
                ) : (
                  <li>No seminal tracks available.</li>
                )}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Access Points
              </h2>
              <ul className="space-y-3 text-sm text-gray-300">
                {accessPoints.length > 0 ? (
                  accessPoints.map((item) => (
                    <li key={item.id}>
                      {item.name} — {item.category}
                    </li>
                  ))
                ) : (
                  <li>No access points available.</li>
                )}
              </ul>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}