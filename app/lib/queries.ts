import { supabase } from "./supabase";
import { Location } from "./types";

export async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    throw error;
  }

  return data as Location[];
}

export async function getSceneEssentials(locationId: string) {
  const { data, error } = await supabase
    .from("scene_essentials")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSonicIdentity(locationId: string) {
  const { data, error } = await supabase
    .from("sonic_identity")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSeminalTracks(locationId: string) {
  const { data, error } = await supabase
    .from("seminal_tracks")
    .select("*")
    .eq("location_id", locationId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAccessPoints(locationId: string) {
  const { data, error } = await supabase
    .from("access_points")
    .select("*")
    .eq("location_id", locationId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}