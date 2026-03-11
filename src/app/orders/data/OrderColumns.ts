import { ColDef } from "ag-grid-community";

export const ORDERS_DEFAULT_VISIBLE = [
  "order_id",
  "customer_name",
  "order_date",
  "items_count",
  "total",
  "status",
  "tracking_number",
];

export const ordersColumns: ColDef[] = [
  { headerName: "Order ID", field: "order_id", width: 130 },
  { headerName: "Customer Name", field: "customer_name" },
  { headerName: "Customer Phone", field: "customer_phone" },
  { headerName: "Order Date", field: "order_date", filter: "agDateColumnFilter" },
  { headerName: "Shipping Address", field: "shipping_address", minWidth: 200 },
  { headerName: "Items Count", field: "items_count", filter: "agNumberColumnFilter", width: 120 },
  {
    headerName: "Subtotal",
    field: "subtotal",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "",
  },
  {
    headerName: "Shipping Cost",
    field: "shipping_cost",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "",
  },
  {
    headerName: "Discount",
    field: "discount",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `${parseFloat(p.value).toFixed(0)}%` : "",
  },
  {
    headerName: "Total",
    field: "total",
    filter: "agNumberColumnFilter",
    valueFormatter: (p: any) => p.value != null ? `$${parseFloat(p.value).toFixed(2)}` : "",
  },
  {
    headerName: "Status",
    field: "status",
    cellStyle: (p: any) => {
      const m: Record<string, any> = {
        delivered: { background: "#dcfce7", color: "#166534" },
        processing: { background: "#dbeafe", color: "#1e40af" },
        confirmed: { background: "#e0e7ff", color: "#3730a3" },
        pending: { background: "#fef9c3", color: "#854d0e" },
      };
      return m[p.value] || {};
    },
  },
  { headerName: "Tracking Number", field: "tracking_number" },
  { headerName: "Est. Delivery", field: "estimated_delivery", filter: "agDateColumnFilter" },
];