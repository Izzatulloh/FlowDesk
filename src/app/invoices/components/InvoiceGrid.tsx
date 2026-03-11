"use client";
import { useState, useCallback, useTransition } from "react";
import GenericGrid from "@/components/GenericGrids";
import { GridView, GridViewConfig } from "../../actions/views/types";
import { Invoice, FilterModel, getInvoices } from "../../actions/invoices";

interface InvoicesGridProps {
  rowData: Invoice[];
  columnDefs: any[];
  defaultVisibleColumns: string[];
  savedViewState: GridViewConfig | null;
  savedViews: GridView[];
  onViewsUpdated: () => Promise<void>;
}

export default function InvoicesGrid({
  rowData,
  columnDefs,
  defaultVisibleColumns,
  savedViewState,
  savedViews,
  onViewsUpdated
}: InvoicesGridProps) {
  const [isPending, startTransition] = useTransition();

  const handleServerRefetch = useCallback((filterModel: FilterModel) => {
    startTransition(async () => {
      const data = await getInvoices(filterModel);
      // rowData ni update qilish parentdan kelishi mumkin
    });
  }, []);

  return (
    <GenericGrid
      title="Invoices"
      page="invoices"
      rowData={rowData}
      columnDefs={columnDefs}
      defaultVisibleColumns={defaultVisibleColumns}
      savedViewState={savedViewState}
      savedViews={savedViews}
      onViewsUpdated={onViewsUpdated}
      onServerRefetch={handleServerRefetch}
      isRefetching={isPending}
    />
  );
}