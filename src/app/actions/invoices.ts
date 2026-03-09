"use server";

import { createClient } from "@/lib/server";

export interface Invoice {
  invoice_id: string;
  customer_name: string;
  customer_email: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  payment_method?: string;
  notes?: string;
}

export type SortModel = { colId: string; sort: "asc" | "desc" }[];

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

function applyFiltersAndSort(
  query: any,
  sortModel?: SortModel,
  filterModel?: FilterModel
) {
  if (filterModel) {
    for (const [field, condition] of Object.entries(filterModel)) {
      if (condition.filterType === "text" && condition.filter) {
        const val = condition.filter;
        switch (condition.type) {
          case "equals": query = query.eq(field, val); break;
          case "notEqual": query = query.neq(field, val); break;
          case "startsWith": query = query.ilike(field, `${val}%`); break;
          case "endsWith": query = query.ilike(field, `%${val}`); break;
          case "notContains": query = query.not(field, "ilike", `%${val}%`); break;
          default: query = query.ilike(field, `%${val}%`); break;
        }
      } else if (condition.filterType === "number" && condition.filter != null) {
        const val = condition.filter;
        switch (condition.type) {
          case "equals": query = query.eq(field, val); break;
          case "notEqual": query = query.neq(field, val); break;
          case "lessThan": query = query.lt(field, val); break;
          case "lessThanOrEqual": query = query.lte(field, val); break;
          case "greaterThan": query = query.gt(field, val); break;
          case "greaterThanOrEqual": query = query.gte(field, val); break;
          case "inRange":
            if (condition.filterTo != null) {
              query = query.gte(field, val).lte(field, condition.filterTo);
            }
            break;
        }
      } else if (condition.filterType === "date") {
        if (condition.dateFrom) query = query.gte(field, condition.dateFrom.substring(0, 10));
        if (condition.dateTo) query = query.lte(field, condition.dateTo.substring(0, 10));
      } else if (condition.filterType === "set" && condition.values?.length) {
        query = query.in(field, condition.values);
      }
    }
  }

  if (sortModel && sortModel.length > 0) {
    for (const sort of sortModel) {
      query = query.order(sort.colId, { ascending: sort.sort === "asc" });
    }
  } else {
    query = query.order("invoice_date", { ascending: false });
  }

  return query;
}

export const getInvoices = async (
  sortModel?: SortModel,
  filterModel?: FilterModel
): Promise<Invoice[]> => {
  const supabase = await createClient();
  let query = supabase.from("invoices").select("*");
  query = applyFiltersAndSort(query, sortModel, filterModel);
  const { data, error } = await query;
  if (error) { console.error("Error fetching invoices:", error); return []; }
  return data || [];
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices").select("*").eq("invoice_id", invoiceId).single();
  if (error) { console.error("Error fetching invoice:", error); return null; }
  return data;
};
