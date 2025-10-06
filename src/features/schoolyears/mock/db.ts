import { SchoolYearItem } from '../types';

const LS_KEY = 'schoolyears:list:v1';

const SEED: SchoolYearItem[] = [
  { idSchoolYear: 1, clave: '2024-1', nombre: '2024 - Semestre 1', fechaInicio: '2024-01-15', fechaFin: '2024-06-30', status: 1 },
  { idSchoolYear: 2, clave: '2024-2', nombre: '2024 - Semestre 2', fechaInicio: '2024-08-01', fechaFin: '2024-12-20', status: 1 },
];

export function loadSchoolYearsFromCache(): SchoolYearItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
      return SEED.slice();
    }
    return JSON.parse(raw) as SchoolYearItem[];
  } catch (e) {
    console.error('loadSchoolYearsFromCache', e);
    return SEED.slice();
  }
}

export function saveSchoolYearsToCache(items: SchoolYearItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function createSchoolYearMock(item: Omit<SchoolYearItem, 'idSchoolYear'>): SchoolYearItem {
  const list = loadSchoolYearsFromCache();
  const next = Math.max(0, ...list.map((l) => l.idSchoolYear)) + 1;
  const created: SchoolYearItem = { ...item, idSchoolYear: next } as SchoolYearItem;
  list.unshift(created);
  saveSchoolYearsToCache(list);
  return created;
}

export function updateSchoolYearMock(item: SchoolYearItem): SchoolYearItem {
  const list = loadSchoolYearsFromCache().map((l) => (l.idSchoolYear === item.idSchoolYear ? item : l));
  saveSchoolYearsToCache(list);
  return item;
}

export function deleteSchoolYearMock(id: number) {
  const list = loadSchoolYearsFromCache().filter((l) => l.idSchoolYear !== id);
  saveSchoolYearsToCache(list);
}
