"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Kanban,
  FileText,
  Settings,
  Plus,
  Map,
  Calculator,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Boards",
    href: "/boards",
    icon: Kanban,
  },
  {
    name: "Trip Map",
    href: "/dashboard/map",
    icon: Map,
  },
  {
    name: "Budget Tracker",
    href: "/dashboard/budget",
    icon: Calculator,
  },
  {
    name: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  // Check active state for Dashboard and Boards
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {/* Create New Board Button */}
        <div className="mb-4">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700"
                  size="icon"
                >
                  <Link href="/boards?create=true">
                    <Plus className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Create New Board</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              asChild
              className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
              variant="default"
            >
              <Link href="/boards?create=true">
                <Plus className="h-4 w-4" />
                Create New Board
              </Link>
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            
            if (isCollapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={active ? "secondary" : "ghost"}
                      className="h-10 w-10 rounded-lg"
                      size="icon"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Button
                key={item.name}
                asChild
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3",
                  active && "bg-secondary font-medium"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-sm font-medium mb-1">Need Help?</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Check out our guide to get started with your first trip board.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Guide
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}