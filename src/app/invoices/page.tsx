import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import InvoicesClient from "./InvoicesClient";

export default async function InvoicesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <InvoicesClient />;
}