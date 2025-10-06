import { apiFetch } from '@/lib/fetcher';
import {
  CreatePlanEstudiosDTO,
  UpdatePlanEstudiosDTO,
} from '../types/PlanEstudiosDTO';
import { PlanEstudiosItem } from '../types/PlanEstudiosItem';
import { PlanEstudiosData } from '../types/PlanEstudiosResponse';

export async function getPlanEstudios(campusId?: number, page: number = 1, pageSize: number = 20): Promise<PlanEstudiosData> {
  let url = `/PlanEstudios?page=${page}&pageSize=${pageSize}`;
  if (campusId) {
    url += `&campusId=${campusId}`;
  }

  return await apiFetch(url);
}

export async function createPlanEstudios(
  data: CreatePlanEstudiosDTO
): Promise<PlanEstudiosItem> {
  return await apiFetch<PlanEstudiosItem>('/PlanEstudios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updatePlanEstudios(
  data: UpdatePlanEstudiosDTO
): Promise<PlanEstudiosItem> {
  const res = await apiFetch<PlanEstudiosItem>(`/PlanEstudios`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res;
}

export async function deletePlanEstudios(id: number) {
  const res = await apiFetch(`/PlanEstudios`, {
    method: 'DELETE',
  });
  return res;
}