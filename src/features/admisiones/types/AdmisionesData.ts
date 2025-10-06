export interface AdmisionesData {
  items: AdmisionItem[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface AdmisionItem {
  idAspirante: number
  personaId: number
  nombreCompleto: string
  email: string
  aspiranteEstatus: string
  fechaRegistro: string
  planEstudios: string
}

