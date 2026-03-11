"use server";

import { createClient } from "@/lib/server";

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