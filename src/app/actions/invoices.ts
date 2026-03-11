"use server";

import { createClient } from "@/lib/server";

export interface Invoice {
  invoice_id: string;
  customer_name: string;
  customer_email?: string;
  invoice_date: string;
  due_date: string;
  amount?: number;
  tax?: number;
  total?: number;
  status: "paid" | "sent" | "draft" | "overdue" | "cancelled";
  payment_method?: string;
  notes?: string;
}

export type FilterModel = Record<
  string,
  {
    filterType: string;
    type?: string;
    filter?: string | number;
    filterTo?: string | number;
    values?: string[];
    dateFrom?: string;
    dateTo?: string;
  }
>;

function applyFilters(query: any, filterModel?: FilterModel) {
  if (filterModel) {
    for (const [field, cond] of Object.entries(filterModel)) {
      if (cond.filterType === "text" && cond.filter) {
        const val = cond.filter;
        query = query.ilike(field, `%${val}%`);
      } else if (cond.filterType === "number" && cond.filter != null) {
        query = query.eq(field, cond.filter);
      } else if (cond.filterType === "date") {
        if (cond.dateFrom) query = query.gte(field, cond.dateFrom.substring(0,10));
        if (cond.dateTo) query = query.lte(field, cond.dateTo.substring(0,10));
      } else if (cond.filterType === "set" && cond.values?.length) {
        query = query.in(field, cond.values);
      }
    }
  }
  return query.order("invoice_date", { ascending: false });
}

export const getInvoices = async (filterModel?: FilterModel): Promise<Invoice[]> => {
  const supabase = await createClient();
  let query = supabase.from("invoices").select("*");
  query = applyFilters(query, filterModel);
  const { data, error } = await query;
  if (error) { console.error("Error fetching invoices:", error); return []; }
  return data || [];
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("invoices").select("*").eq("invoice_id", invoiceId).single();
  if (error) { console.error("Error fetching invoice:", error); return null; }
  return data;
};