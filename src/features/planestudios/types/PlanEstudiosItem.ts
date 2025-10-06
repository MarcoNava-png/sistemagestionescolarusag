export interface PlanEstudiosItem {
  idPlanEstudios: number;
  clavePlanEstudios: string;
  nombrePlanEstudios: string;
  rvoe: string;
  permiteAdelantar: boolean;
  version: string;
  duracionMeses: number;
  minimaAprobatoriaParcial: number;
  minimaAprobatoriaFinal: number;
  periodicidad: string; // del GET
}