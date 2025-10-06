// types/AdmisionesResponse.ts
export type ISODateString = string;

export interface DireccionDto {
  calle: string;
  numero: string;
  codigoPostalId: number;
}

export interface UserLite {
  email?: string;
  phoneNumber?: string;
}

export interface PersonaLite {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: ISODateString;
  estatus: string;

  personaGenero?: string | { id: number; genero: string } | null;
  direccion?: DireccionDto;

  correoElectronico?: string | null;
  telefono?: string | null;
  user?: UserLite | null;
}

export interface AspiranteDto {
  id: number;
  fechaRegistro: ISODateString;
  estatus: string;
  persona: PersonaLite;
}

export interface ProgramaDto {
  id: number;
  nombre: string;
  nivel?: number;
  departamento?: {
    id: number;
    nombre: string;
  };
}

export interface AdmissionItem {
  aspirante: AspiranteDto;
  programa: ProgramaDto | null;
  fechaPostulacion: ISODateString;
}

export interface AdmissionResponse {
  items: AdmissionItem[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}

// Para POST de creación (la API responde 1 item)
export type AdmissionCreateResponse = AdmissionItem;
