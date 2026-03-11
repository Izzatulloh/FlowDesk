"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { getInvoices, Invoice } from "../../actions/invoices";
import { getViews } from "../../actions/views/getViews";
import { getViewById } from "../../actions/views/getViewById";
import { GridView } from "@/app/actions/views/types";
import { GridViewConfig } from "@/components/GenericGrids";
import InvoicesHeader from "../components/InvoiceHeader";
import InvoicesGrid from "../components/InvoiceGrid";
import { INVOICES_DEFAULT_VISIBLE, invoicesColumns } from "../data/InvoiceColumns";

export default function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [savedViews, setSavedViews] = useState<GridView[]>([]);
  const [activeView, setActiveView] = useState<GridViewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [invoicesData, viewsData] = await Promise.all([getInvoices(), getViews("invoices")]);
        setInvoices(invoicesData);
        setSavedViews(viewsData);

        // Example: default viewId
        const view = await getViewById("default-view-id");
        if (view) setActiveView({ columnState: view.column_state, filterModel: view.filter_model });
      } catch {
        setError("Failed to load data. Check your Supabase connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleViewsUpdated = async () => setSavedViews(await getViews("invoices"));

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-8 space-y-6">
        <InvoicesHeader />

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
          <InvoicesGrid
            rowData={invoices}
            columnDefs={invoicesColumns}
            defaultVisibleColumns={INVOICES_DEFAULT_VISIBLE}
            savedViewState={activeView}
            savedViews={savedViews}
            onViewsUpdated={handleViewsUpdated}
          />
        )}
      </div>
    </div>
  );
}