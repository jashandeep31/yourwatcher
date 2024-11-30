import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <div className="w-full">{children}</div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
