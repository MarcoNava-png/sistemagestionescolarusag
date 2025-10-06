// src/features/admisiones/mock/db.ts
export type LocalAdmission = {
  id: number;
  nombreCompleto: string;
  correo?: string | null;
  telefono?: string | null;
  estatus?: string | null;
  fechaRegistro?: string | null;   // ISO
  programaNombre?: string | null;  // ← nombre del plan (Radiología, etc.)
  nivelNombre?: string | null;     // ← nombre del nivel (Bachillerato, etc.)
};

// Puedes dejar inicial vacío o precargar
export const ADMISSIONS_SEED: LocalAdmission[] = [
  // {
  //   id: 1,
  //   nombreCompleto: "Carlos Pérez López",
  //   correo: "carlos.perez@example.com",
  //   telefono: "4771234567",
  //   estatus: "Registrado",
  //   fechaRegistro: "2025-09-20T12:00:00.000Z",
  //   programaNombre: "Radiología",
  //   nivelNombre: "Licenciatura",
  // },
];
