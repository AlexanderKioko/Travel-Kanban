"use client";

import { useEffect } from "react";
import { useUI } from "@/store/useUI";
import { useSession } from "@/store/useSession";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarOpen, isMobile, setIsMobile, setSidebarOpen } = useUI();
  const { user } = useSession();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <Navbar user={user} />
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Layout Container */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={cn(
            "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform border-r bg-card transition-transform duration-300 ease-in-out md:relative md:top-0 md:z-0 md:translate-x-0",
            // Mobile behavior
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : // Desktop behavior
                sidebarOpen
                ? "md:w-64"
                : "md:w-16"
          )}
        >
          <Sidebar isCollapsed={!sidebarOpen && !isMobile} />
        </aside>

        {/* Main Content Area */}
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            // Adjust margin on mobile when sidebar is open
            isMobile && sidebarOpen ? "md:ml-0" : "",
            // Adjust on desktop based on sidebar state
            !isMobile && !sidebarOpen ? "md:ml-16" : "md:ml-0"
          )}
        >
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}