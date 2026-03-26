export type Location = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  tier: number;
  summary: string;
  genres: string[];
  sounds_and_microscenes: string | null;
};

export type ClubEntry = {
  name: string;
  status?: string;
  note?: string;
};

export type DJGenerationEntry = {
  generation: string;
  names: string[];
};

export type SceneEssentialsRow = {
  id: string;
  location_id: string;
  clubs: ClubEntry[];
  djs_by_generation: DJGenerationEntry[];
  notes: string | null;
  current_energy: string | null;
  resident_backbone: string | null;
  how_scene_functions: string | null;
};

export type SonicIdentityRow = {
  id: string;
  location_id: string;
  description: string;
  dancefloor_behaviour: string | null;
  tempo_range: string | null;
};

export type SeminalTrackRow = {
  id: string;
  location_id: string;
  artist: string;
  track: string;
  year: number | null;
  note: string | null;
};

export type AccessPointRow = {
  id: string;
  location_id: string;
  name: string;
  category: string;
  status: string | null;
  note: string | null;
  url: string | null;
  sort_order: number;
};

export type DiggingPathStepRow = {
  id: string;
  location_id: string;
  step_number: number;
  title: string;
  instruction: string;
};

export type SceneDefiningMixRow = {
  id: string;
  location_id: string;
  title: string;
  note: string | null;
  url: string | null;
  sort_order: number;
};

export type DocumentaryRow = {
  id: string;
  location_id: string;
  title: string;
  note: string | null;
  url: string | null;
  sort_order: number;
};