import { apiFetch } from "@/lib/fetcher";
import { MedioContactoData } from "../types/mediocontactoItem";


export async function getMedioContacto(): Promise<MedioContactoData> {
  return await apiFetch<MedioContactoData>(`/Catalogos/medios-contacto`);
}