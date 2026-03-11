"use server";

import { createClient } from "@/lib/server";
import { GridView, GridViewConfig } from "./types";

export const createView = async (
  viewName: string,
  page: string,
  viewConfig: GridViewConfig
): Promise<GridView | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("grid_views")
    .insert({
      user_id: user.id,
      view_name: viewName,
      page,
      column_state: viewConfig.columnState,
      filter_model: viewConfig.filterModel,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating view:", error);
    return null;
  }

  return data;
};