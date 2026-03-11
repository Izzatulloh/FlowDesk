"use client";

import GenericGrid from "@/components/GenericGrids";
import { Order, FilterModel, getOrders } from "../../actions/orders";
import { GridView, GridViewConfig } from "../../actions/views/types";
import { useTransition, useCallback } from "react";
import { ORDERS_DEFAULT_VISIBLE, ordersColumns } from "../data/OrderColumns";

interface OrdersGridProps {
    rowData: Order[];
    savedViews: GridView[];
    savedViewState: GridViewConfig | null;
    onViewsUpdated: () => void;
}

export default function OrdersGrid({
    rowData,
    savedViews,
    savedViewState,
    onViewsUpdated,
}: OrdersGridProps) {
    const [isPending, startTransition] = useTransition();
    const handleServerRefetch = useCallback((filterModel: FilterModel) => {
        startTransition(async () => {
            const data = await getOrders(filterModel);
            rowData.splice(0, rowData.length, ...data);
        });
    }, [rowData]);

    return (
        <GenericGrid
            title="Orders"
            page="orders"
            rowData={rowData}
            columnDefs={ordersColumns}
            defaultVisibleColumns={ORDERS_DEFAULT_VISIBLE}
            savedViewState={savedViewState}
            savedViews={savedViews}
            onViewsUpdated={onViewsUpdated}
            onServerRefetch={handleServerRefetch}
            isRefetching={isPending}
        />
    );
}