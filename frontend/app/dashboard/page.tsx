import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { fetchAgentsData } from "@/lib/auth";

export default async function Page() {
  const response = await fetchAgentsData({
    params: { limit: 10 },
  }).catch((err) => {
    console.log("Error loading oage", err);
    if (err?.message?.includes("Unauthorized")) {
      // redirect to login
      redirect("/login");
    }
    return null;
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full">
              <SectionCards />
              <div className="flex-1">
                <DataTable
                  data={response?.data || []}
                  totalPages={response?.total_pages || 1}
                  totalRecords={response?.total_records || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
