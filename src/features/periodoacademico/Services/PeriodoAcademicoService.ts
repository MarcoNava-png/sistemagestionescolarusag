
import { apiFetch } from "@/lib/fetcher";
import { PeriodoAcademicoData } from "../Types/PeriodoAcademicoItems";


export async function getPeriodoAcademico(): Promise<PeriodoAcademicoData> {
  return await apiFetch<PeriodoAcademicoData>(`/PeriodoAcademico`);
}