"use server";

import { createClient } from "@/lib/server";

export interface Order {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  shipping_address: string;
  items_count: number;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "delivered";
  tracking_number?: string;
  estimated_delivery?: string;
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

function applyFiltersAndSort(query: any, filterModel?: FilterModel, sortModel?: { colId: string, sort: "asc" | "desc" }[]) {
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
    query = query.order("order_date", { ascending: false });
  }

  return query;
}

export const getOrders = async (
  filterModel?: FilterModel,
  sortModel?: { colId: string, sort: "asc" | "desc" }[]
): Promise<Order[]> => {
  const supabase = await createClient();
  let query = supabase.from("orders").select("*");
  query = applyFiltersAndSort(query, filterModel, sortModel);
  const { data, error } = await query;
  if (error) { console.error("Error fetching orders:", error); return []; }
  return data || [];
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();
  if (error) { console.error("Error fetching order:", error); return null; }
  return data;
};