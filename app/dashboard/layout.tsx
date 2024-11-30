import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full ">
          <div className="md:hidden block  py-3 border-b sticky top-0 bg-background z-10">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
