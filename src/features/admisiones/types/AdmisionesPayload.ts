// types/AdmissionCreatePayload.ts

/**
 * Este es el DTO que envías a la API.
 * Los campos *Id provienen de selects en el UI (catálogos).
 */
export interface AdmissionCreatePayload {
  // Datos de persona
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string; // ISO (p.ej. "2000-05-12T00:00:00.000Z")
  generoId: number;        // <-- Select: Género

  // Contacto
  correo: string;
  telefono: string;
  curp: string;

  // Dirección
  calle: string;
  numeroExterior: string;
  /** opcional: si no aplica, envía "" o null según tu backend */
  numeroInterior?: string;
  codigoPostalId: number;  // <-- Select/Autocomplete: Código Postal

  // Académico / Admisiones
  campusId: number;          // <-- Select: Campus
  planEstudiosId: number;    // <-- Select: Plan de estudios
  aspiranteStatusId: number; // <-- Select: Estatus de aspirante
  medioContactoId: number;   // <-- Select: Medio de contacto
  horarioId: number;         // <-- Select: Horario

  // Otros
  notas: string;
  atendidoPorUsuarioId: string | null; // usuario asignado (si aplica)
}
