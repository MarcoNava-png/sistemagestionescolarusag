import { HorarioItem } from "../types";

const LS_KEY = 'horarios:list:v1';

const SEED: HorarioItem[] = [
  { idHorario: 1, nombre: 'Mañana A', horaInicio: '08:00', horaFin: '10:00', dias: 'Lun,Mar,Mié', status: 1 },
  { idHorario: 2, nombre: 'Tarde B', horaInicio: '14:00', horaFin: '16:00', dias: 'Jue,Vie', status: 1 },
];

export function loadHorariosFromCache(): HorarioItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
      return SEED.slice();
    }
    return JSON.parse(raw) as HorarioItem[];
  } catch (e) {
    console.error('loadHorariosFromCache', e);
    return SEED.slice();
  }
}

export function saveHorariosToCache(items: HorarioItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function createHorarioMock(item: Omit<HorarioItem, 'idHorario'>): HorarioItem {
  const list = loadHorariosFromCache();
  const next = Math.max(0, ...list.map((l) => l.idHorario)) + 1;
  const created: HorarioItem = { ...item, idHorario: next } as HorarioItem;
  list.unshift(created);
  saveHorariosToCache(list);
  return created;
}

export function updateHorarioMock(item: HorarioItem): HorarioItem {
  const list = loadHorariosFromCache().map((l) => (l.idHorario === item.idHorario ? item : l));
  saveHorariosToCache(list);
  return item;
}

export function deleteHorarioMock(id: number) {
  const list = loadHorariosFromCache().filter((l) => l.idHorario !== id);
  saveHorariosToCache(list);
}
