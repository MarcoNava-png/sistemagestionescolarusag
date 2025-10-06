import { apiFetch } from "@/lib/fetcher";
import { EstatusAspiranteData } from "../types/EstatusAspiranteItem";


export async function getEstatusAspirante(): Promise<EstatusAspiranteData> {
  return await apiFetch<EstatusAspiranteData>(`/Catalogos/aspirante-status`);

}