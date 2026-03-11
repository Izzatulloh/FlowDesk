"use server";

import { createClient } from "@/lib/server";
import { GridView } from "./types";

export const getViews = async (page: string): Promise<GridView[]> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("grid_views")
    .select("*")
    .eq("user_id", user.id)
    .eq("page", page)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch views:", error);
    return [];
  }

  return data || [];
};