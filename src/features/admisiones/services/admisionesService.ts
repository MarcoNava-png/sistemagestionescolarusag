import {
  loadAdmissionsFromCache,
  removeAdmissionFromCache,
  updateAdmissionInCache,
} from "./admissionsLocal";
import type { LocalAdmission } from "@/features/admisiones/mock/db";
import { apiFetch } from "@/lib/fetcher";
import { AdmisionesData, AdmisionItem } from "../types/AdmisionesData";
import { CrearAdmision } from "../types/CrearAdmision";
import { BitacoraSeguimiento } from "../types/BitacoraSeguimiento";
import { CreateBitacora } from "../types/CreateBitacora";
import { EstadoCivil, PersonaEstadoCivil } from "../types/Admisiones";

export async function getAdmissions(page: number = 1, pageSize: number = 20, filter?: string): Promise<AdmisionesData> {
  let url = `/Aspirante?page=${page}&pageSize=${pageSize}`;
  if (filter && filter.trim()) {
    url += `&filter=${encodeURIComponent(filter.trim())}`;
  }
  return await apiFetch<AdmisionesData>(url);
}

export async function getAdmissionByIdData(id: number): Promise<AdmisionItem | null> {
  const url = `/Aspirante/${id}`;
  return await apiFetch<AdmisionItem>(url);
}

export async function createAdmission(
  payload: CrearAdmision 
): Promise<any> {
  return await apiFetch<any>(`/Aspirante`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
}

export async function updateAdmission(id: number, changes: Partial<LocalAdmission>) {
  const current = loadAdmissionsFromCache().find((x) => x.id === id);
  if (!current) throw new Error("No encontrado");
  const updated = { ...current, ...changes };

  try {
    await apiFetch(`/Aspirante/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    });
    updateAdmissionInCache(updated);
    return updated;
  } catch (e) {
    updateAdmissionInCache(updated);
    return updated;
  }
}

export async function deleteAdmission(id: number) {
  removeAdmissionFromCache(id);
}

export async function getAspiranteBitacoraSeguimiento(): Promise<BitacoraSeguimiento> {
  return await apiFetch<BitacoraSeguimiento>(`/Aspirante/bitacora-seguimiento?aspiranteId=9`);
}

export async function estadosCiviles() {
  return await apiFetch<EstadoCivil[]>(`/Catalogos/estado-civil`);
}

export async function createBitacoraSeguimiento(data: CreateBitacora): Promise<BitacoraSeguimiento> {
  return await apiFetch<BitacoraSeguimiento>(`/Aspirante/bitacora-seguimiento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getBitacoraByAspirante(aspiranteId: number): Promise<BitacoraSeguimiento[]>
{
  const resp = await apiFetch<any>(`/Aspirante/bitacora-seguimiento?aspiranteId=${aspiranteId}`);
  // Soporta que la API regrese un item o un arreglo o {items: []}
  if (Array.isArray(resp)) return resp as BitacoraSeguimiento[];
  if (Array.isArray(resp?.items)) return resp.items as BitacoraSeguimiento[];
  if (resp) return [resp as BitacoraSeguimiento];
  return [];
}
