"use client";

import { Package } from "lucide-react";

export default function OrdersHeader() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
    </div>
  );
}