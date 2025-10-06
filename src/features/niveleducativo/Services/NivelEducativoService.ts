
import { apiFetch } from "@/lib/fetcher";
import { NivelEducativoData } from "../types/NivelEducativoItems";

export async function getNivelEducativo(): Promise<NivelEducativoData> {
  return await apiFetch<NivelEducativoData>(`/Catalogos/niveles-educativos`);
}
