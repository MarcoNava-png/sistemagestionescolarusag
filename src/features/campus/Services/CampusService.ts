import { apiFetch } from "@/lib/fetcher";
import { CampusData } from "../types/CampusItem";




export async function getCampus(): Promise<CampusData> {
  return await apiFetch<CampusData>(`/campus`);
}