import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";

import { LayoutDashboardIcon, Users2Icon, Stethoscope } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

export default function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-gray-300 dark:border-gray-600"
    >
      <SidebarHeader className="flex px-2 group-data-[state=expanded]:justify-end">
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/dashboard" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  tooltip="Dashboard"
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "bg-black text-white hover:bg-black/85 hover:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <LayoutDashboardIcon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-gray-700",
                    )}
                  />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <NavLink to="/patients" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  tooltip="Patients"
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "bg-black text-white hover:bg-black/85 hover:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <Users2Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-gray-700",
                    )}
                  />
                  <span>Patients</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <NavLink to="/staff" end>
              {({ isActive }) => (
                <SidebarMenuButton
                  tooltip="Staff"
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "bg-black text-white hover:bg-black/85 hover:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <Stethoscope
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-gray-700",
                    )}
                  />
                  <span>Staff</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
