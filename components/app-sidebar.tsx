import { Calendar, Home, Inbox, LogOut, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Website UpTime Monitor",
    url: "/dashboard/website-uptime-monitor",
    icon: Home,
  },
  {
    title: "SSL certificate Monitor",
    url: "/dashboard/ssl-certificate-monitor",
    icon: Inbox,
  },
  {
    title: "Domain Expiry Monitor",
    url: "/dashboard/domain-expiry-monitor",
    icon: Calendar,
  },
  {
    title: "VPS Resource Monitor (soon)",
    url: "/dashboard/vps-resource-monitor",
    icon: Search,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="min-h-screen flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="mt-12 border border-yellow-500 bg-yellow-50 p-3 text-sm text-yellow-500 rounded">
                We are facing problem in sending Mail. Due to no http on are
                servers. Will be fixed soon.
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-12">
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton asChild>
                <Link
                  href={"/logout"}
                  className="text-red-500 hover:text-red-500 duration-300 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Link>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
