export type Persona = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento?: string | null;
  estatus?: string | null;
  personaGenero?: string | null;
};

export type Estudiante = {
  id: string;
  persona: Persona;
};

export type Programa = { id: string; nombre: string };
export type Plan = { id: string; nombre: string };

export type Inscripcion = {
  id: string;
  estudiante: Estudiante;
  programa: Programa;
  plan?: Plan | null;
  periodo?: string | null;
  estatus?: string | null;
  fechaInscripcion?: string | null;
};

export type Paginated<T> = {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

export interface Student {
  items: StudentItem[],
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number,
}

export interface StudentItem {
  idEstudiante: number,
  matricula: string,
  nombreCompleto: string,
  telefono: string,
  planEstudios: string,
}

export interface EstudianteItem {
  matricula: string
  idPersona: number
  fechaIngreso: string
  idPlanActual: number
  activo: boolean
}
