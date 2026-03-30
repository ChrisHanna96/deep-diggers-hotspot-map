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

function isNonEmpty(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sortByOrder<T extends { sort_order?: number | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
}

function sortDiggingPath(items: DiggingPathStepRow[]) {
  return [...items].sort((a, b) => a.step_number - b.step_number);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-wide text-gray-400">{title}</h2>
      <div className="rounded-xl border border-white/10 bg-[#161B21] p-4">
        {children}
      </div>
    </section>
  );
}

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
      if (!location) {
        setIsExpanded(false);
        setSceneEssentials(null);
        setSonicIdentity(null);
        setSeminalTracks([]);
        setAccessPoints([]);
        setDiggingPath([]);
        setSceneDefiningMixes([]);
        setDocumentaries([]);
        return;
      }

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

  const orderedTracks = useMemo(
    () => sortByOrder(seminalTracks),
    [seminalTracks]
  );

  const orderedAccessPoints = useMemo(
    () => sortByOrder(accessPoints),
    [accessPoints]
  );

  const orderedMixes = useMemo(
    () => sortByOrder(sceneDefiningMixes),
    [sceneDefiningMixes]
  );

  const orderedDocumentaries = useMemo(
    () => sortByOrder(documentaries),
    [documentaries]
  );

  const orderedDiggingPath = useMemo(
    () => sortDiggingPath(diggingPath),
    [diggingPath]
  );

  const hasSoundsAndMicroscenes = isNonEmpty(location?.sounds_and_microscenes);
  const hasSceneEssentials = isNonEmpty(sceneEssentials?.notes);
  const hasResidentBackbone = isNonEmpty(sceneEssentials?.resident_backbone);
  const hasHowSceneFunctions = isNonEmpty(sceneEssentials?.how_scene_functions);
  const hasCurrentEnergy = isNonEmpty(sceneEssentials?.current_energy);
  const hasDjsByGeneration = !!sceneEssentials?.djs_by_generation?.length;
  const hasClubs = !!sceneEssentials?.clubs?.length;
  const hasSonicIdentity = isNonEmpty(sonicIdentity?.description);
  const hasDancefloorBehaviour =
    isNonEmpty(sonicIdentity?.dancefloor_behaviour) ||
    isNonEmpty(sonicIdentity?.tempo_range);
  const hasMixes = !!orderedMixes.length;
  const hasTracks = !!orderedTracks.length;
  const hasAccessPoints = !!orderedAccessPoints.length;
  const hasDiggingPath = !!orderedDiggingPath.length;
  const hasDocumentaries = !!orderedDocumentaries.length;

  if (!location) {
    return (
      <aside className="h-full w-full overflow-y-auto bg-[#0F1720] p-5 text-white md:p-6">
        <div className="space-y-5">
          <header className="border-b border-white/10 pb-5">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl">
              Select a city
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Choose a point on the globe to open the scene panel.
            </p>
          </header>

          <Section title="How to Use">
            <div className="space-y-4 text-sm leading-relaxed text-gray-300">
              <div>
                <p className="font-medium text-white">1. Navigate the globe</p>
                <p className="mt-1">
                  Drag to rotate, zoom in, and select a city marker.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">2. Open the scene panel</p>
                <p className="mt-1">
                  Selecting a city loads its local notes, DJs, clubs, tracks, and links.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">3. Use links to dig deeper</p>
                <p className="mt-1">
                  Access points, mixes, and documentaries give you routes into further research.
                </p>
              </div>
            </div>
          </Section>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-full overflow-y-auto bg-[#0F1720] p-5 text-white md:p-6">
      <div className="space-y-8">
        <header className="border-b border-white/10 pb-5">
          <h1 className="text-xl font-semibold tracking-tight leading-tight text-white">
            {location.city}
          </h1>
          <p className="mt-1 text-sm text-gray-400">{location.country}</p>

          {isNonEmpty(location.summary) && (
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {location.summary}
            </p>
          )}

          {!loading && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-200 transition hover:border-teal-400/60 hover:bg-teal-500/15"
              >
                {isExpanded ? "Hide Scene" : "Explore Scene"}
              </button>
            </div>
          )}
        </header>

        {loading && (
          <p className="text-sm text-gray-400">Loading scene data...</p>
        )}

        {!loading && isExpanded && (
          <>
            {hasSoundsAndMicroscenes && (
              <Section title="Sounds & Microscenes">
                <p className="text-sm leading-relaxed text-gray-300">
                  {location.sounds_and_microscenes}
                </p>
              </Section>
            )}

            {hasSceneEssentials && (
              <Section title="Scene Essentials">
                <p className="text-sm leading-relaxed text-gray-300">
                  {sceneEssentials?.notes}
                </p>
              </Section>
            )}

            {hasResidentBackbone && (
              <Section title="Resident Backbone">
                <p className="text-sm leading-relaxed text-gray-300">
                  {sceneEssentials?.resident_backbone}
                </p>
              </Section>
            )}

            {hasHowSceneFunctions && (
              <Section title="How the Scene Functions">
                <p className="text-sm leading-relaxed text-gray-300">
                  {sceneEssentials?.how_scene_functions}
                </p>
              </Section>
            )}

            {hasCurrentEnergy && (
              <Section title="Current Energy">
                <p className="text-sm leading-relaxed text-gray-300">
                  {sceneEssentials?.current_energy}
                </p>
              </Section>
            )}

            {hasDjsByGeneration && (
              <Section title="DJs by Generation">
                <div className="space-y-4">
                  {sceneEssentials?.djs_by_generation.map((group, index) => (
                    <div key={`${group.generation}-${index}`}>
                      <p className="text-sm font-medium text-white">
                        {group.generation}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300">
                        {group.names.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasClubs && (
              <Section title="Clubs">
                <div className="space-y-4">
                  {sceneEssentials?.clubs.map((club, index) => (
                    <div
                      key={`${club.name ?? "club"}-${club.status ?? "status"}-${index}`}
                    >
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
                        <p className="mt-2 text-sm leading-relaxed text-gray-300">
                          {club.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasSonicIdentity && (
              <Section title="Sonic Identity">
                <p className="text-sm leading-relaxed text-gray-300">
                  {sonicIdentity?.description}
                </p>
              </Section>
            )}

            {hasDancefloorBehaviour && (
              <Section title="Dancefloor Behaviour">
                <div className="space-y-3">
                  {isNonEmpty(sonicIdentity?.dancefloor_behaviour) && (
                    <p className="text-sm leading-relaxed text-gray-300">
                      {sonicIdentity?.dancefloor_behaviour}
                    </p>
                  )}
                  {isNonEmpty(sonicIdentity?.tempo_range) && (
                    <p className="text-sm leading-relaxed text-gray-400">
                      Tempo range: {sonicIdentity?.tempo_range}
                    </p>
                  )}
                </div>
              </Section>
            )}

            {hasMixes && (
              <Section title="Scene-Defining Mix">
                <div className="space-y-4">
                  {orderedMixes.map((mix) => (
                    <div key={mix.id}>
                      <p className="text-sm font-medium text-white">
                        {mix.title}
                      </p>
                      {mix.note && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-300">
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
              </Section>
            )}

            {hasTracks && (
              <Section title="Seminal Tracks">
                <ul className="space-y-4 text-sm text-gray-300">
                  {orderedTracks.map((track) => (
                    <li key={track.id}>
                      <span className="text-white">
                        {track.artist} — {track.track}
                      </span>
                      {track.year ? ` (${track.year})` : ""}
                      {track.note && (
                        <p className="mt-2 leading-relaxed text-gray-400">
                          {track.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {hasAccessPoints && (
              <Section title="Access Points">
                <div className="space-y-4">
                  {orderedAccessPoints.map((item) => (
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
                        <p className="mt-2 text-sm leading-relaxed text-gray-300">
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
              </Section>
            )}

            {hasDiggingPath && (
              <Section title="Digging Path">
                <ol className="space-y-4 text-sm text-gray-300">
                  {orderedDiggingPath.map((step) => (
                    <li key={step.id}>
                      <span className="text-white">
                        Step {step.step_number}: {step.title}
                      </span>
                      <p className="mt-2 leading-relaxed text-gray-400">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {hasDocumentaries && (
              <Section title="Documentaries / Further Viewing">
                <div className="space-y-4">
                  {orderedDocumentaries.map((doc) => (
                    <div key={doc.id}>
                      <p className="text-sm font-medium text-white">
                        {doc.title}
                      </p>
                      {doc.note && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-300">
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
              </Section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}