export interface CreatePlanEstudiosDTO {
  clavePlanEstudios: string;
  nombrePlanEstudios: string;
  rvoe: string;
  permiteAdelantar: boolean;
  version: string;
  duracionMeses: number;
  minimaAprobatoriaParcial: number;
  minimaAprobatoriaFinal: number;
  idPeriodicidad: number;
  idNivelEducativo: number;
  idCampus: number;
}

export interface UpdatePlanEstudiosDTO extends CreatePlanEstudiosDTO {
  idPlanEstudios: number;
  status: number;
}