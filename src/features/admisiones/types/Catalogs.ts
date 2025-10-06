// src/features/admisiones/types/Catalogs.ts
export interface CatalogOption {
  id: number;
  nombre: string;
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface CodigoPostalOption {
  id: number;     // codigoPostalId
  codigo: string; // "37000"
  asentamiento?: string;
  municipio?: string;
  estado?: string;
}


export type GeneroOption = CatalogOption;
export type CampusOption = CatalogOption;
export type AspiranteStatusOption = CatalogOption;
export type MedioContactoOption = CatalogOption;
export type HorarioOption = CatalogOption;

export interface PlanEstudiosOption extends CatalogOption {
  nivel?: number;
}