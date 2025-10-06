// src/features/admisiones/mock/catalogs.ts
export type CatalogOpt = { id: number; nombre: string };

export const GENDERS: CatalogOpt[] = [
  { id: 1, nombre: "Masculino" },
  { id: 2, nombre: "Femenino" },
  { id: 3, nombre: "Otro" },
];

// 🔹 Niveles académicos
export const STUDY_LEVELS: CatalogOpt[] = [
  { id: 1, nombre: "Bachillerato" },
  { id: 2, nombre: "Licenciatura" },
  { id: 3, nombre: "Maestría" },
];

// 🔹 Planes de estudio / Carreras (ejemplos)
export const STUDY_PLANS: CatalogOpt[] = [
  { id: 101, nombre: "Radiología" },
  { id: 102, nombre: "Enfermería" },
  { id: 103, nombre: "Ingeniería en Sistemas" },
  { id: 104, nombre: "Derecho" },
  { id: 105, nombre: "Administración" },
  { id: 106, nombre: "Odontología" },
  { id: 107, nombre: "Psicología" },
];

export const CAMPUSES: CatalogOpt[] = [
  { id: 1, nombre: "Campus Centro" },
  { id: 2, nombre: "Campus Norte" },
];

export const ASPIRANT_STATUSES: CatalogOpt[] = [
  { id: 1, nombre: "Registrado" },
  { id: 2, nombre: "En seguimiento" },
  { id: 3, nombre: "Admitido" },
  { id: 4, nombre: "Rechazado" },
];

export const CONTACT_CHANNELS: CatalogOpt[] = [
  { id: 1, nombre: "Web" },
  { id: 2, nombre: "Facebook" },
  { id: 3, nombre: "Referido" },
  { id: 4, nombre: "Teléfono" },
];

export const SCHEDULES: CatalogOpt[] = [
  { id: 1, nombre: "Matutino" },
  { id: 2, nombre: "Vespertino" },
  { id: 3, nombre: "Sabatino" },
];

// Helpers para mapear id → nombre
export function nameById(arr: CatalogOpt[], id?: number | null) {
  if (!id) return null;
  const f = arr.find((x) => x.id === id);
  return f?.nombre ?? null;
}
