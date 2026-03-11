"use client";
import { FileText } from "lucide-react";

export default function InvoicesHeader() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
      </div>
    </div>
  );
}