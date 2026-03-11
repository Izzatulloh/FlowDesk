import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import OrdersClient from "./client/OrdersClient";

export default async function OrdersPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return <OrdersClient />;
}