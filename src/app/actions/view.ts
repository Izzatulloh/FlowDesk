"use server";

import { createClient } from "@/lib/server";

export type GridViewConfig = {
  columnState: any;
  filterModel: any;
  sortModel: any;
};

export interface GridView {
  id: string;
  user_id: string;
  view_name: string;
  page: string;
  column_state: any;
  filter_model: any;
  sort_model: any;
  created_at: string;
  updated_at: string;
}

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
    process.stderr.write(`Failed to fetch views: ${error.message}\n`);
    return [];
  }

  return data || [];
};

export const getViewById = async (viewId: string): Promise<GridView | null> => {
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
      sort_model: viewConfig.sortModel,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating view:", error);
    return null;
  }

  return data;
};

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
      sort_model: viewConfig.sortModel,
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

export const deleteView = async (viewId: string): Promise<boolean> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("grid_views")
    .delete()
    .eq("id", viewId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting view:", error);
    return false;
  }

  return true;
};
