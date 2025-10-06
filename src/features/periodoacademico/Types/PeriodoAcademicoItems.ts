export interface PeriodoAcademicoData {
  items: PeriodoAcademicoItem[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface PeriodoAcademicoItem {
  idPeriodoAcademico: number
  clave: string
  nombre: string
  periodicidad: string
  fechaInicio: string
  fechaFin: string
}
