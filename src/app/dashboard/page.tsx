import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText, Package, ChevronRight
} from "lucide-react";
import { getViews } from "../actions/views/getViews";



export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(routes.login);

  const [invoiceViews, orderViews] = await Promise.all([
    getViews("invoices"),
    getViews("orders"),
  ]);

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-8 space-y-8">

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/invoices" className="group block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {invoiceViews.length} view{invoiceViews.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="pt-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                    Invoices
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription>
                    View, sort, filter and save custom invoice table configurations.
                  </CardDescription>
                </div>
              </CardHeader>
              {invoiceViews.length > 0 && (
                <CardContent className="pt-0">
                  <Separator className="mb-3" />
                  <div className="space-y-1.5">
                    {invoiceViews.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{v.view_name}</span>
                      </div>
                    ))}
                    {invoiceViews.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-3.5">+{invoiceViews.length - 3} more</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>

          <Link href="/orders" className="group block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {orderViews.length} view{orderViews.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="pt-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                    Orders
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription>
                    Manage order data with fully customizable saved grid views.
                  </CardDescription>
                </div>
              </CardHeader>
              {orderViews.length > 0 && (
                <CardContent className="pt-0">
                  <Separator className="mb-3" />
                  <div className="space-y-1.5">
                    {orderViews.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                        <span >{v.view_name}</span>
                      </div>
                    ))}
                    {orderViews.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-3.5">+{orderViews.length - 3} more</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>
        </div>

      </div>
    </div>
  );
}
