type CityData = {
  city: string;
  country: string;
  tier: number;
  genres: string[];
  summary: string;
  sceneEssentials: string;
  sonicIdentity: string;
  seminalTracks: string[];
  accessPoints: string[];
};

type CityPanelProps = {
  city: CityData;
};

export default function CityPanel({ city }: CityPanelProps) {
  if (!city) {
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
          <h1 className="text-2xl font-semibold">{city.city}</h1>
          <p className="mt-1 text-sm text-gray-400">{city.country}</p>
          <p className="mt-3 text-sm text-gray-300">Tier {city.tier}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {city.genres.map((genre) => (
              <span
                key={genre}
                className="rounded border border-gray-700 px-2 py-1 text-xs text-gray-300"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-300">
            {city.summary}
          </p>
        </div>

        <button className="w-full rounded border border-gray-700 px-4 py-3 text-left text-sm font-medium hover:bg-gray-800">
          Explore Scene
        </button>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">
            Scene Essentials
          </h2>
          <p className="text-sm leading-6 text-gray-300">
            {city.sceneEssentials}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">
            Sonic Identity
          </h2>
          <p className="text-sm leading-6 text-gray-300">
            {city.sonicIdentity}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">
            Seminal Tracks
          </h2>
          <ul className="space-y-3 text-sm text-gray-300">
            {city.seminalTracks.map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wide text-gray-400">
            Access Points
          </h2>
          <ul className="space-y-3 text-sm text-gray-300">
            {city.accessPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}