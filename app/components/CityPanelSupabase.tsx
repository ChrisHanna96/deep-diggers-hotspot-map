"use client";

import { useEffect, useState } from "react";
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

          {location.sounds_and_microscenes && (
            <div className="mt-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Sounds & Microscenes
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {location.sounds_and_microscenes}
              </p>
            </div>
          )}

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
                Resident Backbone
              </h2>
              <p className="text-sm leading-6 text-gray-300">
                {sceneEssentials?.resident_backbone ??
                  "No resident backbone available."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                How the Scene Functions
              </h2>
              <p className="text-sm leading-6 text-gray-300">
                {sceneEssentials?.how_scene_functions ??
                  "No scene function notes available."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Current Energy
              </h2>
              <p className="text-sm leading-6 text-gray-300">
                {sceneEssentials?.current_energy ??
                  "No current energy notes available."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Who Matters
              </h2>
              <div className="space-y-3">
                {sceneEssentials?.djs_by_generation?.length ? (
                  sceneEssentials.djs_by_generation.map((group) => (
                    <div key={group.generation}>
                      <p className="text-sm font-medium text-white">
                        {group.generation}
                      </p>
                      <p className="text-sm leading-6 text-gray-300">
                        {group.names.join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300">
                    No artist lineage available.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Clubs and Routes
              </h2>
              <div className="space-y-3">
                {sceneEssentials?.clubs?.length ? (
                  sceneEssentials.clubs.map((club) => (
                    <div key={club.name}>
                      <p className="text-sm font-medium text-white">
                        {club.name}
                      </p>
                      {club.status && (
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {club.status}
                        </p>
                      )}
                      {club.note && (
                        <p className="text-sm leading-6 text-gray-300">
                          {club.note}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300">
                    No club routes available.
                  </p>
                )}
              </div>
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
                Dancefloor Behaviour
              </h2>
              <p className="text-sm leading-6 text-gray-300">
                {sonicIdentity?.dancefloor_behaviour ??
                  "No dancefloor behaviour available."}
              </p>
              {sonicIdentity?.tempo_range && (
                <p className="text-sm leading-6 text-gray-400">
                  Tempo range: {sonicIdentity.tempo_range}
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Scene-Defining Mixes
              </h2>
              <div className="space-y-3">
                {sceneDefiningMixes.length ? (
                  sceneDefiningMixes.map((mix) => (
                    <div key={mix.id}>
                      <p className="text-sm font-medium text-white">
                        {mix.title}
                      </p>
                      {mix.note && (
                        <p className="text-sm leading-6 text-gray-300">
                          {mix.note}
                        </p>
                      )}
                      {mix.url && (
                        <a
                          href={mix.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-teal-300 hover:underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300">
                    No scene-defining mixes available.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Seminal Tracks
              </h2>
              <ul className="space-y-3 text-sm text-gray-300">
                {seminalTracks.length ? (
                  seminalTracks.map((track) => (
                    <li key={track.id}>
                      <span className="text-white">
                        {track.artist} — {track.track}
                      </span>
                      {track.year ? ` (${track.year})` : ""}
                      {track.note && (
                        <p className="mt-1 leading-6 text-gray-400">
                          {track.note}
                        </p>
                      )}
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
              <div className="space-y-4">
                {accessPoints.length ? (
                  accessPoints.map((item) => (
                    <div key={item.id}>
                      <p className="text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {item.category}
                        {item.status ? ` · ${item.status}` : ""}
                      </p>
                      {item.note && (
                        <p className="mt-1 text-sm leading-6 text-gray-300">
                          {item.note}
                        </p>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-teal-300 hover:underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300">
                    No access points available.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Digging Path
              </h2>
              <ol className="space-y-3 text-sm text-gray-300">
                {diggingPath.length ? (
                  diggingPath.map((step) => (
                    <li key={step.id}>
                      <span className="text-white">
                        Step {step.step_number}: {step.title}
                      </span>
                      <p className="mt-1 leading-6 text-gray-400">
                        {step.instruction}
                      </p>
                    </li>
                  ))
                ) : (
                  <li>No digging path available.</li>
                )}
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-gray-400">
                Documentaries / Further Viewing
              </h2>
              <div className="space-y-3">
                {documentaries.length ? (
                  documentaries.map((doc) => (
                    <div key={doc.id}>
                      <p className="text-sm font-medium text-white">
                        {doc.title}
                      </p>
                      {doc.note && (
                        <p className="text-sm leading-6 text-gray-300">
                          {doc.note}
                        </p>
                      )}
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-teal-300 hover:underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-300">
                    No documentaries or further viewing available.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}