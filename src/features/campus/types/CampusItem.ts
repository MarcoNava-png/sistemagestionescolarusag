export type CampusData = {
  items: CampusItem[],
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}

export interface CampusItem {
  idCampus: number
  claveCampus: string
  nombre: string
  idDireccion: number
  activo: boolean
  convenioAlcance: any[]
  idDireccionNavigation: any
  planEstudios: any[]
  createdAt: string
  updatedAt: any
  createdBy: string
  updatedBy: any
  status: number
}
