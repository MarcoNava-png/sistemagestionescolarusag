import { HorariosData, CreateHorarioPayload, UpdateHorarioPayload } from '../types';
import { loadHorariosFromCache, createHorarioMock, updateHorarioMock, deleteHorarioMock } from '../mock/db';

export async function getHorarios(): Promise<HorariosData> {
  // Simulate async
  return new Promise((res) => setTimeout(() => res(loadHorariosFromCache()), 150));
}

export async function createHorario(data: CreateHorarioPayload) {
  return new Promise((res) => setTimeout(() => res(createHorarioMock({ ...data, status: 1 })), 150));
}

export async function updateHorario(data: UpdateHorarioPayload) {
  return new Promise((res) => setTimeout(() => res(updateHorarioMock({ ...data } as any)), 150));
}

export async function deleteHorario(id: number) {
  return new Promise((res) => setTimeout(() => { deleteHorarioMock(id); res(undefined); }, 150));
}
