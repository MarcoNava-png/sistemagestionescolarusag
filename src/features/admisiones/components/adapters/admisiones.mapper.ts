import type { AdmissionItem } from "@/features/admisiones/types/AdmisionesResponse";

export interface AspiranteRow {
  id: number;
  nombreCompleto: string;
  email: string | null;
  telefono: string | null;
  programa: string | null;
  estatus: string;
  fechaRegistroISO: string;
}

function prefer<T>(...values: (T | null | undefined)[]): T | null {
  for (const v of values) if (v !== undefined && v !== null && String(v).trim() !== "") return v as T;
  return null;
}

export function toRows(items: AdmissionItem[]): AspiranteRow[] {
  return items.map((it) => {
    const p = it.aspirante.persona;
    const nombreCompleto = [p.nombre, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(" ");

    // Algunas APIs rellenan email/phone en distintos campos: persona.user, correoElectronico, telefono, etc.
    const email = prefer<string>(p.correoElectronico, p.user?.email);
    const telefono = prefer<string>(p.telefono, p.user?.phoneNumber);

    return {
      id: it.aspirante.id,
      nombreCompleto,
      email,
      telefono,
      programa: it.programa?.nombre ?? null,
      estatus: it.aspirante.estatus,
      fechaRegistroISO: it.aspirante.fechaRegistro,
    };
  });
}
