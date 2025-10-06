"use client";

import { useEffect, useState } from "react";

// Role type and canonical roles for the app
export type Role =
  | "admin"
  | "director"
  | "coordinador"
  | "docente"
  | "alumno"
  | "controlescolar"
  | "guest";

export const ROLES: Role[] = [
  "admin",
  "director",
  "coordinador",
  "docente",
  "alumno",
  "controlescolar",
  "guest",
];

// A very small hook to centralize role handling using localStorage.
// Important: do NOT read localStorage during render. Initialize to a
// server-stable default ('guest') and hydrate the real value after mount
// inside useEffect. This avoids React hydration mismatches.
export default function useRole() {
  const [role, setRoleState] = useState<Role>("guest");

  // On mount, read the persisted role and update state. This runs only on the client
  // after the initial render so server and initial client HTML remain identical.
  useEffect(() => {
    try {
      const stored: string | null = localStorage.getItem("role");
      if (stored && ROLES.includes(stored as Role)) {
        setRoleState(stored as Role);
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist role changes
  // NOTE: avoid automatically persisting the default value on mount because
  // that can overwrite an auth process that writes the role slightly later.
  // Persist explicitly when setRole is called.
  const setRole = (r: Role | string) => {
    const newRole = (ROLES.includes(r as Role) ? (r as Role) : ("guest" as Role));
    try {
      localStorage.setItem("role", newRole);
    } catch (e) {
      // ignore
    }
    setRoleState(newRole);
  };

  return { role, setRole };
}
