"use server";

import { createClient } from "@/lib/server";
import { GridView, GridViewConfig } from "./types";

export const updateView = async (
  viewId: string,
  viewName: string,
  viewConfig: GridViewConfig
): Promise<GridView | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("grid_views")
    .update({
      view_name: viewName,
      column_state: viewConfig.columnState,
      filter_model: viewConfig.filterModel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", viewId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating view:", error);
    return null;
  }

  return data;
};