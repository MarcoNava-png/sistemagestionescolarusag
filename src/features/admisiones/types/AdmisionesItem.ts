// types/AdmissionsItem.ts
/* export interface AdmissionsItem {
  id: number;
  name: string;                 // "Nombre ApellidoPaterno ApellidoMaterno"
  email: string;                // si no viene en la API, deja "—"
  phone: string;                // si no viene en la API, deja "—"
  status: string;               // p.ej. "Registrado"
  registerDate: string;         // ISO - viene de fechaRegistro
  img: string;                  // url o '', según tu UI
  programs: { name: string }[]; // programas a los que postuló
  plans?: { name: string }[];   // opcional, si usas Plan de Estudios
}
  */

// types/AdmisionesResponse.ts
// types/AdmisionesItem.ts
// 👇 Solo tipos para la UI; NO importar desde barrels que re-exporten este mismo archivo.

export interface AdmissionUIItem {
  id: number;                    // aspirante.id
  nombreCompleto: string;        // "Nombre ApPaterno ApMaterno"
  fechaNacimiento: string;       // ISO
  fechaRegistro: string;         // ISO
  estatus: string;               // aspirante.estatus
  genero?: string | null;        // string normalizado
  correo?: string | null;
  telefono?: string | null;
  direccion?: {
    calle: string;
    numero: string;
    codigoPostalId: number;
  } | null;
  programa?: {
    id: number;
    nombre: string;
    nivel?: number;
    departamento?: string;
  } | null;
}
