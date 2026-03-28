"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAccessPoints,
  getDiggingPath,
  getDocumentaries,
  getSceneDefiningMixes,
  getSceneEssentials,
  getSeminalTracks,
  getSonicIdentity,
} from "../lib/queries";
import {
  AccessPointRow,
  DiggingPathStepRow,
  DocumentaryRow,
  Location,
  SceneDefiningMixRow,
  SceneEssentialsRow,
  SeminalTrackRow,
  SonicIdentityRow,
} from "../lib/types";

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
  const [diggingPath, setDiggingPath] = useState<DiggingPathStepRow[]>([]);
  const [sceneDefiningMixes, setSceneDefiningMixes] = useState<
    SceneDefiningMixRow[]
  >([]);
  const [documentaries, setDocumentaries] = useState<DocumentaryRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCityData() {
      if (!location) return;

      setIsExpanded(false);
      setLoading(true);

      try {
        const [
          sceneData,
          sonicData,
          tracksData,
          accessData,
          pathData,
          mixesData,
          documentariesData,
        ] = await Promise.all([
          getSceneEssentials(location.id),
          getSonicIdentity(location.id),
          getSeminalTracks(location.id),
          getAccessPoints(location.id),
          getDiggingPath(location.id),
          getSceneDefiningMixes(location.id),
          getDocumentaries(location.id),
        ]);

        setSceneEssentials(sceneData);
        setSonicIdentity(sonicData);
        setSeminalTracks(tracksData);
        setAccessPoints(accessData);
        setDiggingPath(pathData);
        setSceneDefiningMixes(mixesData);
        setDocumentaries(documentariesData);
      } catch (error) {
        console.error("Failed to load city panel data:", error);
        setSceneEssentials(null);
        setSonicIdentity(null);
        setSeminalTracks([]);
        setAccessPoints([]);
        setDiggingPath([]);
        setSceneDefiningMixes([]);
        setDocumentaries([]);
      } finally {
        setLoading(false);
      }
    }

    loadCityData();
  }, [location]);

  const microSceneLabels = useMemo(() => {
    if (!location?.sounds_and_microscenes) return [];
    return location.sounds_and_microscenes
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [location]);

  if (!location) {
    return (
      <aside className="h-full w-full overflow-y-auto bg-[#12161B] p-5 text-white md:p-6">
        <div className="flex h-full flex-col justify-center">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-800 bg-[#161B21] p-6 shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-300">
              Global Deep Diggers
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
              Explore the map
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-300">
              Drag the globe to explore scenes.
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Select a city to open scene details, key figures, mixes and
              digging routes.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-full overflow-y-auto bg-[#12161B] p-5 text-white md:p-6">
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-800 bg-[#161B21] p-4">
          <p className="text-sm font-medium text-teal-300">
            Drag the globe to explore scenes
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Select cities to open scene details, key figures, mixes and digging
            routes.
          </p>
        </div>

        <div>
          {microSceneLabels.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {microSceneLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-teal-700/40 bg-teal-900/20 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-teal-200"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-semibold leading-tight">{location.city}</h1>
          <p className="mt-1 text-sm text-gray-400">{location.country}</p>

          {location.sounds_and_microscenes && (
            <div className="mt-4">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Sounds & Microscenes
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {location.sounds_and_microscenes}
              </p>
            </div>
          )}

          <p className="mt-4 text-sm leading-7 text-gray-300">
            {location.summary}
          </p>
        </div>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full rounded-xl border border-teal-700/40 bg-teal-900/20 px-4 py-3 text-left text-sm font-medium text-teal-200 transition hover:bg-teal-900/30"
        >
          {isExpanded ? "Hide Scene" : "Explore Scene"}
        </button>

        {loading && (
          <p className="text-sm text-gray-400">Loading scene data...</p>
        )}

        {isExpanded && !loading && (
          <>
            {sceneEssentials?.notes && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Scene Essentials
                </h2>
                <p className="text-sm leading-7 text-gray-300">
                  {sceneEssentials.notes}
                </p>
              </section>
            )}

            {sceneEssentials?.resident_backbone && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Resident Backbone
                </h2>
                <p className="text-sm leading-7 text-gray-300">
                  {sceneEssentials.resident_backbone}
                </p>
              </section>
            )}

            {sceneEssentials?.how_scene_functions && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  How the Scene Functions
                </h2>
                <p className="text-sm leading-7 text-gray-300">
                  {sceneEssentials.how_scene_functions}
                </p>
              </section>
            )}

            {sceneEssentials?.current_energy && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Current Energy
                </h2>
                <p className="text-sm leading-7 text-gray-300">
                  {sceneEssentials.current_energy}
                </p>
              </section>
            )}

            {!!sceneEssentials?.djs_by_generation?.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Key Figures (Past / Present)
                </h2>
                <div className="space-y-4">
                  {sceneEssentials.djs_by_generation.map((group) => (
                    <div key={group.generation}>
                      <p className="text-sm font-medium text-white">
                        {group.generation}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-gray-300">
                        {group.names.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!!sceneEssentials?.clubs?.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Clubs and Routes
                </h2>
                <div className="space-y-4">
                  {sceneEssentials.clubs.map((club) => (
                    <div key={club.name}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {club.name}
                        </p>
                        {club.status && (
                          <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                            {club.status}
                          </span>
                        )}
                      </div>
                      {club.note && (
                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {club.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sonicIdentity?.description && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Sonic Identity
                </h2>
                <p className="text-sm leading-7 text-gray-300">
                  {sonicIdentity.description}
                </p>
              </section>
            )}

            {(sonicIdentity?.dancefloor_behaviour || sonicIdentity?.tempo_range) && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Dancefloor Behaviour
                </h2>
                {sonicIdentity?.dancefloor_behaviour && (
                  <p className="text-sm leading-7 text-gray-300">
                    {sonicIdentity.dancefloor_behaviour}
                  </p>
                )}
                {sonicIdentity?.tempo_range && (
                  <p className="text-sm leading-6 text-gray-400">
                    Tempo range: {sonicIdentity.tempo_range}
                  </p>
                )}
              </section>
            )}

            {!!sceneDefiningMixes.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Scene-Defining Mixes
                </h2>
                <div className="space-y-4">
                  {sceneDefiningMixes.map((mix) => (
                    <div key={mix.id}>
                      <p className="text-sm font-medium text-white">
                        {mix.title}
                      </p>
                      {mix.note && (
                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {mix.note}
                        </p>
                      )}
                      {mix.url && (
                        <a
                          href={mix.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-teal-300 hover:underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!!seminalTracks.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Seminal Tracks
                </h2>
                <ul className="space-y-4 text-sm text-gray-300">
                  {seminalTracks.map((track) => (
                    <li key={track.id}>
                      <span className="text-white">
                        {track.artist} — {track.track}
                      </span>
                      {track.year ? ` (${track.year})` : ""}
                      {track.note && (
                        <p className="mt-2 leading-7 text-gray-400">
                          {track.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!!accessPoints.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Access Points
                </h2>
                <div className="space-y-4">
                  {accessPoints.map((item) => (
                    <div key={item.id}>
                      <p className="text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                          {item.category}
                        </span>
                        {item.status && (
                          <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                            {item.status}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {item.note}
                        </p>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-teal-300 hover:underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!!diggingPath.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Digging Path
                </h2>
                <ol className="space-y-4 text-sm text-gray-300">
                  {diggingPath.map((step) => (
                    <li key={step.id}>
                      <span className="text-white">
                        Step {step.step_number}: {step.title}
                      </span>
                      <p className="mt-2 leading-7 text-gray-400">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {!!documentaries.length && (
              <section className="space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-gray-400">
                  Documentaries / Further Viewing
                </h2>
                <div className="space-y-4">
                  {documentaries.map((doc) => (
                    <div key={doc.id}>
                      <p className="text-sm font-medium text-white">
                        {doc.title}
                      </p>
                      {doc.note && (
                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {doc.note}
                        </p>
                      )}
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-teal-300 hover:underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}