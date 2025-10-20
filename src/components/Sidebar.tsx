"use client";

import { useState, useEffect } from "react";
import useRole from "@/hooks/useRole";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BaseItem, Item, menuItems, ParentItem } from "@/lib/menuitems";

function isParentItem(i: Item): i is ParentItem {
  return Array.isArray((i as ParentItem).children);
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const { role } = useRole();

  const ROLE_ALIASES: Record<string, string[]> = {
    admin: ["admin"],
    director: ["director"],
    coordinador: ["coordinador"],
    docente: ["docente", "teacher"],
    alumno: ["alumno", "student", "parent"],
    controlescolar: ["controlescolar", "accounting", "cashier"],
    guest: ["guest"],
  };

  const normalize = (s?: string) => (s || "").toLowerCase().trim();

  const roleMatches = (menuRole: string) => {
    const r = normalize(role);
    const m = normalize(menuRole);
    if (!r || !m) return false;
    if (r === m) return true;

    const canonicalForR =
      Object.keys(ROLE_ALIASES).find((k) => ROLE_ALIASES[k].includes(r)) || r;

    if (m === canonicalForR) return true;
    if (ROLE_ALIASES[canonicalForR]?.includes(m)) return true;

    return false;
  };

  const isVisibleForRoleItem = (it: BaseItem) => it.visible.some((v) => roleMatches(v));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname === "/";
    }
    return pathname === href || (pathname.startsWith(`${href}/`) && href !== "/");
  };

  const isParentActive = (i: Item) =>
    isParentItem(i) && i.children.some((c) => isActive(c.href));

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((section) => {
      section.items.forEach((item) => {
        if (isParentItem(item) && isVisibleForRoleItem(item)) {
          initial[item.label] = isParentActive(item);
        }
      });
    });
    setOpenSections((prev) => ({ ...prev, ...initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, role]);

  const toggleSection = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  const Caret = ({ open }: { open: boolean }) => (
    <svg
      className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className={`h-full overflow-y-auto ${isMobile ? "px-1" : "pr-2"}`}>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>

      <div className={`space-y-1 ${isMobile ? "px-1" : "px-2"}`}>
        {menuItems.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isMobile && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                // Visibilidad por rol
                const isVisible = isParentItem(item)
                  ? isVisibleForRoleItem(item) &&
                  item.children.some((c) => isVisibleForRoleItem(c))
                  : isVisibleForRoleItem(item);

                if (!isVisible) return null;

                const iconSize = isMobile ? 20 : 16;

                // Padre con submenu
                if (isParentItem(item)) {
                  const open = !!openSections[item.label];
                  const parentActive = isParentActive(item);

                  return (
                    <div key={item.label} className="relative group">
                      <button
                        type="button"
                        onClick={() => toggleSection(item.label)}
                        className={cn(
                          "w-full flex items-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors text-left",
                          isMobile ? "justify-center" : "justify-start",
                          parentActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                        aria-expanded={open}
                        aria-controls={`submenu-${item.label}`}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-lg transition-colors",
                            isMobile ? "p-2" : "p-1.5 mr-1.5",
                            parentActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          )}
                        >
                          <Image
                            src={item.icon || "/folder.png"}
                            alt={item.label}
                            width={iconSize}
                            height={iconSize}
                            className={isMobile ? "w-5 h-5" : "w-4 h-4"}
                          />
                        </div>
                        {!isMobile && (
                          <span className="flex-1 whitespace-normal break-words leading-snug pr-2">
                            {item.label}
                          </span>
                        )}
                        {!isMobile && <Caret open={open} />}
                      </button>

                      {/* Subitems */}
                      <div
                        id={`submenu-${item.label}`}
                        className={cn(
                          "pl-5 overflow-hidden transition-[max-height] duration-300",
                          open ? "max-h-96" : "max-h-0"
                        )}
                      >
                        <div className="mt-1 space-y-1">
                          {item.children
                            .filter((c) => isVisibleForRoleItem(c))
                            .map((child) => {
                              const active = isActive(child.href);
                              return (
                                <Link
                                  key={`${child.href}-${child.label}`}
                                  href={child.href}
                                  className={cn(
                                    "flex items-center py-2 px-3 text-sm rounded-lg transition-colors",
                                    active
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-600 hover:bg-gray-100"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mr-2 h-1.5 w-1.5 rounded-full",
                                      active ? "bg-blue-600" : "bg-gray-300"
                                    )}
                                  />
                                  <span className="whitespace-normal break-words leading-snug">
                                    {child.label}
                                  </span>
                                </Link>
                              );
                            })}
                        </div>
                      </div>

                      {isMobile && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                }

                // Hoja (link normal)
                const active = isActive(item.href);
                return (
                  <div key={`${item.href}-${item.label}`} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                        isMobile ? "justify-center" : "justify-start",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-lg transition-colors",
                          isMobile ? "p-2" : "p-1.5 mr-3",
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        )}
                      >
                        <Image
                          src={item.icon || "/dot.png"}
                          alt={item.label}
                          width={iconSize}
                          height={iconSize}
                          className={isMobile ? "w-5 h-5" : "w-4 h-4"}
                        />
                      </div>
                      {!isMobile && (
                        <span className="whitespace-normal break-words leading-snug">
                          {item.label}
                        </span>
                      )}
                    </Link>

                    {isMobile && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
