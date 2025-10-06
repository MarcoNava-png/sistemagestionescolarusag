import { SubjectItem } from "../types";

const LS_KEY = 'subjects:list:v1';

const SEED: SubjectItem[] = [
  { idSubject: 1, clave: 'MAT101', nombre: 'Matemáticas I', creditos: 4, status: 1 },
  { idSubject: 2, clave: 'HIS101', nombre: 'Historia', creditos: 3, status: 1 },
];

export function loadSubjectsFromCache(): SubjectItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
      return SEED.slice();
    }
    return JSON.parse(raw) as SubjectItem[];
  } catch (e) {
    console.error('loadSubjectsFromCache', e);
    return SEED.slice();
  }
}

export function saveSubjectsToCache(items: SubjectItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function createSubjectMock(item: Omit<SubjectItem, 'idSubject'>): SubjectItem {
  const list = loadSubjectsFromCache();
  const next = Math.max(0, ...list.map((l) => l.idSubject)) + 1;
  const created: SubjectItem = { ...item, idSubject: next } as SubjectItem;
  list.unshift(created);
  saveSubjectsToCache(list);
  return created;
}

export function updateSubjectMock(item: SubjectItem): SubjectItem {
  const list = loadSubjectsFromCache().map((l) => (l.idSubject === item.idSubject ? item : l));
  saveSubjectsToCache(list);
  return item;
}

export function deleteSubjectMock(id: number) {
  const list = loadSubjectsFromCache().filter((l) => l.idSubject !== id);
  saveSubjectsToCache(list);
}
