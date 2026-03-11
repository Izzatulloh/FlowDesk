"use server";

import { createClient } from "@/lib/server";
import { GridView } from "./types";

export const getViewById = async (
  viewId: string
): Promise<GridView | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("grid_views")
    .select("*")
    .eq("id", viewId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching view:", error);
    return null;
  }

  return data;
};