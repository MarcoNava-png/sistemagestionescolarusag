export interface SchoolYearItem {
  idSchoolYear: number;
  clave: string;
  nombre: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  status?: number;
}

export type SchoolYearsData = SchoolYearItem[];

export interface CreateSchoolYearPayload {
  clave: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface UpdateSchoolYearPayload extends CreateSchoolYearPayload {
  idSchoolYear: number;
  status?: number;
}
