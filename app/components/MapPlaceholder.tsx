"use client";

type MapPlaceholderProps = {
  onSelectCity: (cityKey: "chicago" | "detroit" | "bucharest") => void;
};

export default function MapPlaceholder({ onSelectCity }: MapPlaceholderProps) {
  return (
    <div className="flex-1 border-r border-gray-800 p-8">
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <p className="text-gray-500">Map will go here</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelectCity("chicago")}
            className="rounded border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800"
          >
            Select Chicago
          </button>

          <button
            onClick={() => onSelectCity("detroit")}
            className="rounded border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800"
          >
            Select Detroit
          </button>

          <button
            onClick={() => onSelectCity("bucharest")}
            className="rounded border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800"
          >
            Select Bucharest
          </button>
        </div>
      </div>
    </div>
  );
}