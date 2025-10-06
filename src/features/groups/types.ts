export interface GroupData {
  items: GroupItem[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface GroupItem {
  idGrupo: number
  planEstudios: string
  periodoAcademico: string
  consecutivoPeriodicidad: number
  numeroGrupo: number
  turno: string
  capacidadMaxima: number
}

export interface CreateGroupPayload {
  idPlanEstudios: number,
  idPeriodoAcademico: number,
  numeroCuatrimestre: number,
  numeroGrupo: number,
  idTurno: number,
  capacidadMaxima: number
}

export interface UpdateGroupPayload {
  idGrupo?: number,
  idPlanEstudios: number,
  idPeriodoAcademico: number,
  numeroCuatrimestre: number,
  numeroGrupo: number,
  idTurno: number,
  capacidadMaxima: number,
  status: number
}