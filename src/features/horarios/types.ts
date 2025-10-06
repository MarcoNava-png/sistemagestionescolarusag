export interface HorarioItem {
  idHorario: number;
  nombre: string;
  horaInicio: string; // HH:MM
  horaFin: string;   // HH:MM
  dias: string; // e.g. "Lun,Mar"
  status?: number;
}

export type HorariosData = HorarioItem[];

export interface CreateHorarioPayload {
  nombre: string;
  horaInicio: string;
  horaFin: string;
  dias: string;
}

export interface UpdateHorarioPayload extends CreateHorarioPayload {
  idHorario: number;
  status?: number;
}
