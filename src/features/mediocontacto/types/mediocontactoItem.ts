export type MedioContactoData = MedioContactoItem[]

export interface MedioContactoItem {
  idMedioContacto: number
  descMedio: string
  activo: boolean
  aspirante: any[]
  createdAt: string
  updatedAt: any
  createdBy: string
  updatedBy: any
  status: number
}
