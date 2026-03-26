import { supabase } from "./supabase";
import {
  Location,
  SceneEssentialsRow,
  SonicIdentityRow,
  SeminalTrackRow,
  AccessPointRow,
  DiggingPathStepRow,
  SceneDefiningMixRow,
  DocumentaryRow
} from "./types";

export async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("city");

  if (error) throw error;
  return data || [];
}

export async function getSceneEssentials(locationId: string): Promise<SceneEssentialsRow | null> {
  const { data, error } = await supabase
    .from("scene_essentials")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error) return null;
  return data;
}

export async function getSonicIdentity(locationId: string): Promise<SonicIdentityRow | null> {
  const { data, error } = await supabase
    .from("sonic_identity")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error) return null;
  return data;
}

export async function getSeminalTracks(locationId: string): Promise<SeminalTrackRow[]> {
  const { data, error } = await supabase
    .from("seminal_tracks")
    .select("*")
    .eq("location_id", locationId)
    .order("year", { ascending: true });

  if (error) return [];
  return data || [];
}

export async function getAccessPoints(locationId: string): Promise<AccessPointRow[]> {
  const { data, error } = await supabase
    .from("access_points")
    .select("*")
    .eq("location_id", locationId)
    .order("sort_order");

  if (error) return [];
  return data || [];
}

export async function getDiggingPath(locationId: string): Promise<DiggingPathStepRow[]> {
  const { data, error } = await supabase
    .from("digging_paths")
    .select("*")
    .eq("location_id", locationId)
    .order("step_number");

  if (error) return [];
  return data || [];
}

export async function getSceneDefiningMixes(locationId: string): Promise<SceneDefiningMixRow[]> {
  const { data, error } = await supabase
    .from("scene_defining_mixes")
    .select("*")
    .eq("location_id", locationId)
    .order("sort_order");

  if (error) return [];
  return data || [];
}

export async function getDocumentaries(locationId: string): Promise<DocumentaryRow[]> {
  const { data, error } = await supabase
    .from("documentaries")
    .select("*")
    .eq("location_id", locationId)
    .order("sort_order");

  if (error) return [];
  return data || [];
}