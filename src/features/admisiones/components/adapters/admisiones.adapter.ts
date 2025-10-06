// src/features/admisiones/adapters/admisiones.adapter.ts
import type { AdmissionItem } from "@/features/admisiones/types/AdmisionesResponse";
import type { AdmissionUIItem } from "@/features/admisiones/types/AdmisionesItem";

/** Toma un AdmissionItem (API) y lo normaliza a AdmissionUIItem (UI) */
export function mapAdmissionItemToUI(item: AdmissionItem): AdmissionUIItem {
  const asp = item.aspirante;
  const p = asp?.persona ?? null;

  const nombreCompleto = p
    ? [p.nombre, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(" ")
    : "—";

  // Email y teléfono pueden venir en distintos campos (persona.user, correoElectronico, telefono)
  const correo =
    (p?.correoElectronico && p.correoElectronico.trim()) ||
    (p?.user?.email && p.user.email.trim()) ||
    null;

  const telefono =
    (p?.telefono && p.telefono.trim()) ||
    (p?.user?.phoneNumber && p.user.phoneNumber.trim()) ||
    null;

  return {
    id: asp?.id ?? 0,
    nombreCompleto,
    fechaNacimiento: p?.fechaNacimiento ?? "",
    fechaRegistro: item?.fechaPostulacion ?? asp?.fechaRegistro ?? "",
    estatus: asp?.estatus ?? "—",
    genero:
      (typeof p?.personaGenero === "string"
        ? p?.personaGenero
        : p?.personaGenero && "genero" in p.personaGenero
        ? p.personaGenero.genero
        : null) ?? null,
    correo,
    telefono,
    direccion: p?.direccion
      ? {
          calle: p.direccion.calle,
          numero: p.direccion.numero,
          codigoPostalId: p.direccion.codigoPostalId,
        }
      : null,
    programa: item?.programa
      ? {
          id: item.programa.id,
          nombre: item.programa.nombre,
          nivel: item.programa.nivel,
          departamento: item.programa.departamento?.nombre,
        }
      : null,
  };
}
