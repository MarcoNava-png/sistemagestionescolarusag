import { PlanEstudiosItem } from "./PlanEstudiosItem";


export interface PlanEstudiosData {
  items: PlanEstudiosItem[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}