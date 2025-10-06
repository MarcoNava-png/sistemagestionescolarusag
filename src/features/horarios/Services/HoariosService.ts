import { apiFetch } from "@/lib/fetcher";
import { HorariosData } from "../types/horariosItem";

export async function getHorarios(): Promise<HorariosData> {
  return await apiFetch<HorariosData>(`/Catalogos/horarios`);
}