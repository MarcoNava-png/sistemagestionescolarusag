export interface EstadoItem {
    id: number,
    nombre: string,
    abreviatura: string,
    municipios: any[]
}

export interface MunicipioItem {
    id: string,
    nombre: string,
    estadoId: number,
    estado: null,
    codigosPostales: null
}

export interface AsentamientoItem {
    id: number,
    codigo: number,
    asentamiento: string,
    municipioId: number,
    municipio: null
}