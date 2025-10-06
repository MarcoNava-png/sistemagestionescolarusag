// src/features/admisiones/services/admissionsLocal.ts
//import { ADMISSIONS_SEED, type LocalAdmission } from "@/features/admisiones/mock/db";

import { ADMISSIONS_SEED, LocalAdmission } from "../muck/db";

const LS_KEY = "admisiones:list:v1";

export function loadAdmissionsFromCache(): LocalAdmission[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(ADMISSIONS_SEED));
      return ADMISSIONS_SEED.slice();
    }
    return JSON.parse(raw) as LocalAdmission[];
  } catch {
    return ADMISSIONS_SEED.slice();
  }
}

export function saveAdmissionsToCache(items: LocalAdmission[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

export function appendAdmissionToCache(item: LocalAdmission) {
  const list = loadAdmissionsFromCache();
  list.unshift(item);
  saveAdmissionsToCache(list);
  return list;
}

export function updateAdmissionInCache(item: LocalAdmission) {
  const list = loadAdmissionsFromCache().map((x) => (x.id === item.id ? item : x));
  saveAdmissionsToCache(list);
  return list;
}

export function removeAdmissionFromCache(id: number) {
  const list = loadAdmissionsFromCache().filter((x) => x.id !== id);
  saveAdmissionsToCache(list);
  return list;
}
