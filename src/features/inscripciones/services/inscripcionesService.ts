import { LocalAdmission } from "@/features/admisiones/muck/db";
import { apiFetch } from "@/lib/fetcher";



export type EnrollmentPayload = {
  aspiranteId: number | string;
  programaId?: number | string | null;
  planId?: number | string | null;
  periodo?: string | null;
};

export async function createEnrollmentFromAdmission(admission: LocalAdmission, payload?: Partial<EnrollmentPayload>) {
  // Try a plausible API endpoint for creating an enrollment
  const body = {
    aspiranteId: admission.id,
    programaId: payload?.programaId ?? null,
    planId: payload?.planId ?? null,
    periodo: payload?.periodo ?? null,
  } as any;

  try {
    // Backend endpoint may be POST /Inscripcion or /Enrollments
    return await apiFetch(`/Inscripcion`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (e) {
    // Try alternative route
    try {
      return await apiFetch(`/Aspirante/${admission.id}/inscribir`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (err) {
      // If backend not available, throw so caller can fallback to local behavior
      throw e;
    }
  }
}
