"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import GenericGrid from "@/components/GenericGrids";
import { getInvoices, Invoice, SortModel, FilterModel } from "../actions/invoices";
import { getViewById, getViews, GridView, GridViewConfig } from "../actions/view";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, InboxIcon } from "lucide-react";

const INVOICES_DEFAULT_VISIBLE = ["invoice_id","customer_name","invoice_date","due_date","total","status"];

const invoicesColumns = [
  { headerName: "Invoice ID",      field: "invoice_id",     width: 130 },
  { headerName: "Customer Name",   field: "customer_name" },
  { headerName: "Customer Email",  field: "customer_email" },
  { headerName: "Invoice Date",    field: "invoice_date",   filter: "agDateColumnFilter" },
  { headerName: "Due Date",        field: "due_date",       filter: "agDateColumnFilter" },
  { headerName: "Amount",          field: "amount",         filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "" },
  { headerName: "Tax",             field: "tax",            filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `${parseFloat(p.value).toFixed(2)}%` : "" },
  { headerName: "Total",           field: "total",          filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "" },
  { headerName: "Status",          field: "status",
    cellStyle: (p: any) => {
      const m: Record<string, any> = {
        paid:      { background: "#dcfce7", color: "#166534" },
        sent:      { background: "#dbeafe", color: "#1e40af" },
        draft:     { background: "#f3f4f6", color: "#374151" },
        overdue:   { background: "#fee2e2", color: "#991b1b" },
        cancelled: { background: "#fef9c3", color: "#854d0e" },
      };
      return m[p.value] || {};
    },
  },
  { headerName: "Payment Method",  field: "payment_method" },
  { headerName: "Notes",           field: "notes" },
];

export default function InvoicesPage() {
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [savedViews, setSavedViews] = useState<GridView[]>([]);
  const [activeView, setActiveView] = useState<GridViewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      try {
        const [invoicesData, viewsData] = await Promise.all([getInvoices(), getViews("invoices")]);
        setInvoices(invoicesData);
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
      const data = await getInvoices(sortModel, filterModel);
      setInvoices(data);
    });
  }, []);

  const handleViewsUpdated = async () => setSavedViews(await getViews("invoices"));

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
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
            title="Invoices"
            page="invoices"
            rowData={invoices}
            columnDefs={invoicesColumns}
            defaultVisibleColumns={INVOICES_DEFAULT_VISIBLE}
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
