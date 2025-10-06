export type NivelEducativoData = NivelEducativoItem[]

export interface NivelEducativoItem {
  idNivelEducativo: number
  descNivelEducativo: string
  activo: boolean
  planEstudios: any[]
}
