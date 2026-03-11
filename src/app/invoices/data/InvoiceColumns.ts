// invoices/data/InvoicesColumns.ts
import { ColDef } from "ag-grid-community";

export const INVOICES_DEFAULT_VISIBLE = [
  "invoice_id",
  "customer_name",
  "invoice_date",
  "due_date",
  "total",
  "status",
];

export const invoicesColumns: ColDef[] = [
  { headerName: "Invoice ID", field: "invoice_id", width: 130 },
  { headerName: "Customer Name", field: "customer_name" },
  { headerName: "Customer Email", field: "customer_email" },
  { headerName: "Invoice Date", field: "invoice_date", filter: "agDateColumnFilter" },
  { headerName: "Due Date", field: "due_date", filter: "agDateColumnFilter" },
  {
    headerName: "Amount",
    field: "amount",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) =>
      p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "",
  },
  {
    headerName: "Tax",
    field: "tax",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) =>
      p.value != null ? `${parseFloat(p.value).toFixed(2)}%` : "",
  },
  {
    headerName: "Total",
    field: "total",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) =>
      p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "",
  },
  {
    headerName: "Status",
    field: "status",
    cellStyle: (p: any) => {
      const m: Record<string, any> = {
        paid: { background: "#dcfce7", color: "#166534" },
        sent: { background: "#dbeafe", color: "#1e40af" },
        draft: { background: "#f3f4f6", color: "#374151" },
        overdue: { background: "#fee2e2", color: "#991b1b" },
        cancelled: { background: "#fef9c3", color: "#854d0e" },
      };
      return m[p.value] || {};
    },
  },
  { headerName: "Payment Method", field: "payment_method" },
  { headerName: "Notes", field: "notes" },
];