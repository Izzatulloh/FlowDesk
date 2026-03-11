// features/orders/OrdersClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { getOrders } from "../../actions/orders";
import { getViews } from "../../actions/views/getViews";
import { getViewById } from "../../actions/views/getViewById";
import { GridView, GridViewConfig } from "../../actions/views/types";
import OrdersHeader from "../components/OrdersHeader";
import OrdersGrid from "../components/OrdersGrid";

export default function OrdersClient() {
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");

  const [orders, setOrders] = useState<any[]>([]);
  const [savedViews, setSavedViews] = useState<GridView[]>([]);
  const [activeView, setActiveView] = useState<GridViewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [ordersData, viewsData] = await Promise.all([getOrders(), getViews("orders")]);
        setOrders(ordersData);
        setSavedViews(viewsData);

        if (viewId) {
          const view = await getViewById(viewId);
          if (view) setActiveView({ columnState: view.column_state, filterModel: view.filter_model });
        }
      } catch {
        setError("Failed to load data. Check your Supabase connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, [viewId]);

  const handleViewsUpdated = async () => setSavedViews(await getViews("orders"));

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-8 space-y-6">
        <OrdersHeader />

        {loading ? (
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-[500px] w-full" />
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <OrdersGrid
            rowData={orders}
            savedViews={savedViews}
            savedViewState={activeView}
            onViewsUpdated={handleViewsUpdated}
          />
        )}
      </div>
    </div>
  );
}