// src/components/dashboard/DashboardShell.tsx
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import React from "react";

// 👇 Usa aquí tu menú personalizado (el largo con items/roles que pegaste)
import AppSidebarNav from "@/components/Sidebar"; 
// Si lo renombraste a SidebarNav.tsx, entonces:
// import AppSidebarNav from "@/components/SidebarNav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        {/* Lado izquierdo: Sidebar de shadcn */}
        <Sidebar collapsible="icon" variant="sidebar" side="left">
          <SidebarHeader className="px-2 py-2">
            {/* Aquí puedes poner tu logo o search */}
            {/* <Logo /> o <SidebarInput placeholder="Buscar..." /> */}
          </SidebarHeader>

          <SidebarSeparator />

          <SidebarContent className="px-1">
            {/* Tu menú personalizado */}
            <AppSidebarNav />
          </SidebarContent>

          <SidebarFooter className="px-2 py-2">
            {/* Algo como Usuario/Salir si quieres */}
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Contenido principal */}
        <SidebarInset>
          {/* Top bar con trigger para colapsar/expandir */}
          <div className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Panel</span>
          </div>

          <div className="flex-1 p-4">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
