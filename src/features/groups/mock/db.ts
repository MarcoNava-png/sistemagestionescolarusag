import type { GroupItem } from "../types";

export const GROUPS_SEED: GroupItem[] = [
  {
    idGrupo: 1,
    planEstudios: "LICENCIATURA EN RADIOLOGÍA E IMAGEN",
    periodoAcademico: "2025-1",
    consecutivoPeriodicidad: 1,
    numeroGrupo: 101,
    turno: "Matutino",
    capacidadMaxima: 30,
  },
  {
    idGrupo: 2,
    planEstudios: "ING. MECÁNICA Y ELECTRÓNICA AUTOMOTRIZ",
    periodoAcademico: "2025-1",
    consecutivoPeriodicidad: 1,
    numeroGrupo: 102,
    turno: "Vespertino",
    capacidadMaxima: 25,
  },
];

const LS_KEY = "groups:list:v1";

export function loadGroupsFromCache(): GroupItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(GROUPS_SEED));
      return GROUPS_SEED.slice();
    }
    return JSON.parse(raw) as GroupItem[];
  } catch (e) {
    return GROUPS_SEED.slice();
  }
}

export function saveGroupsToCache(items: GroupItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

export function appendGroupToCache(item: GroupItem) {
  const list = loadGroupsFromCache();
  list.unshift(item);
  saveGroupsToCache(list);
  return list;
}

export function updateGroupInCache(item: GroupItem) {
  const list = loadGroupsFromCache().map((x) => (x.idGrupo === item.idGrupo ? item : x));
  saveGroupsToCache(list);
  return list;
}

export function removeGroupFromCache(id: number | string) {
  const list = loadGroupsFromCache().filter((x) => String(x.idGrupo) !== String(id));
  saveGroupsToCache(list);
  return list;
}
