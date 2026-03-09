"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import GenericGrid from "@/components/GenericGrids";
import { getOrders, Order, SortModel, FilterModel } from "../actions/orders";
import { getViewById, getViews, GridView, GridViewConfig } from "../actions/view";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package } from "lucide-react";

const ORDERS_DEFAULT_VISIBLE = ["order_id","customer_name","order_date","items_count","total","status","tracking_number"];

const ordersColumns = [
  { headerName: "Order ID",        field: "order_id",          width: 130 },
  { headerName: "Customer Name",   field: "customer_name" },
  { headerName: "Customer Phone",  field: "customer_phone" },
  { headerName: "Order Date",      field: "order_date",        filter: "agDateColumnFilter" },
  { headerName: "Shipping Address",field: "shipping_address",  minWidth: 200 },
  { headerName: "Items Count",     field: "items_count",       filter: "agNumberColumnFilter", width: 120 },
  { headerName: "Subtotal",        field: "subtotal",          filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "" },
  { headerName: "Shipping Cost",   field: "shipping_cost",     filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "" },
  { headerName: "Discount",        field: "discount",          filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `${parseFloat(p.value).toFixed(0)}%` : "" },
  { headerName: "Total",           field: "total",             filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "" },
  { headerName: "Status",          field: "status",
    cellStyle: (p: any) => {
      const m: Record<string, any> = {
        delivered:  { background: "#dcfce7", color: "#166534" },
        processing: { background: "#dbeafe", color: "#1e40af" },
        confirmed:  { background: "#e0e7ff", color: "#3730a3" },
        pending:    { background: "#fef9c3", color: "#854d0e" },
      };
      return m[p.value] || {};
    },
  },
  { headerName: "Tracking Number", field: "tracking_number" },
  { headerName: "Est. Delivery",   field: "estimated_delivery", filter: "agDateColumnFilter" },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");

  const [orders, setOrders] = useState<Order[]>([]);
  const [savedViews, setSavedViews] = useState<GridView[]>([]);
  const [activeView, setActiveView] = useState<GridViewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      try {
        const [ordersData, viewsData] = await Promise.all([getOrders(), getViews("orders")]);
        setOrders(ordersData);
        setSavedViews(viewsData);
        if (viewId) {
          const view = await getViewById(viewId);
          if (view) setActiveView({ columnState: view.column_state, filterModel: view.filter_model, sortModel: view.sort_model });
        }
      } catch {
        setError("Failed to load data. Check your Supabase connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, [viewId]);

  const handleServerRefetch = useCallback((sortModel: SortModel, filterModel: FilterModel) => {
    startTransition(async () => {
      const data = await getOrders(sortModel, filterModel);
      setOrders(data);
    });
  }, []);

  const handleViewsUpdated = async () => setSavedViews(await getViews("orders"));

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          </div>
        </div>

        {loading ? (
          <Card><CardContent className="p-6 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-[500px] w-full" />
          </CardContent></Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <GenericGrid
            title="Orders"
            page="orders"
            rowData={orders}
            columnDefs={ordersColumns}
            defaultVisibleColumns={ORDERS_DEFAULT_VISIBLE}
            savedViewState={activeView}
            savedViews={savedViews}
            onViewsUpdated={handleViewsUpdated}
            onServerRefetch={handleServerRefetch}
            isRefetching={isPending}
          />
        )}
      </div>
    </div>
  );
}
