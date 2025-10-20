// app/dashboard/list/admissions/detailsapplicants/page.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAdmissionTimeline } from "@/features/admisiones/hooks/useAdmissionTimeline";
import Timeline from "@/features/admisiones/components/Timeline";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAdmisiones } from "@/features/admisiones/hooks/useAdmisiones";
import * as inscriptionsService from "@/features/inscriptions/services/inscriptionsService";
import type { LocalAdmission } from "@/features/admisiones/mock/db";
import type { AdmisionItem } from "@/features/admisiones/types/AdmisionesData";
import InscripcionModal from "@/features/inscriptions/components/InscripcionModal";
import { StudentItem } from "@/features/inscriptions/types";
import { getGroups, GroupItem } from "@/features/groups";

/* ---------- Tipos auxiliares ---------- */
type Stats = { contacts: number; notes: number; tasksOpen: number };

/* ---------- UI helpers ---------- */
function Callout() {
  return (
    <div className="mb-4 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-4 text-sm text-blue-800">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-blue-700">
          ℹ️
        </div>
        <div>
          <p className="font-semibold">Seguimiento de Aspirantes</p>
          <p className="mt-0.5">
            Llega aquí desde <span className="font-medium">Admisiones</span>{" "}
            dando <span className="font-medium">doble-click</span> en un
            aspirante para ver su resumen y registrar contactos.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-gray-700">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " +
        (props.className || "")
      }
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className={
        "w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " +
        (props.className || "")
      }
    />
  );
}

function DetailPanel({
  item,
  stats,
  onClear,
}: {
  item: LocalAdmission;
  stats: Stats;
  onClear: () => void;
}) {
  const [showContactForm, setShowContactForm] = useState(false);

  const { timeline, addEntry, updateEntry, removeEntry } = useAdmissionTimeline(item.id as any);

  const { } = useAdmisiones();

  // En el modelo local usamos programaNombre
  const programName = item.programaNombre ?? "—";

  const fmtDate = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${dd}/${m}/${y}`;
  };

  // Responsable / asignado (local editable)
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

  // Estado del contacto local (no hay API real)
  const [contact, setContact] = useState({
    date: "",
    time: "",
    channel: "",
    summary: "",
    nextAction: "",
    reminderAt: "",
    assignedTo: "",
  });

  const guardarContacto = async () => {
    addEntry({
      date: contact.date || undefined,
      time: contact.time || undefined,
      channel: contact.channel || undefined,
      summary: contact.summary || undefined,
      nextAction: contact.nextAction || undefined,
      assignedTo: contact.assignedTo || assignedTo || undefined,
      reminderAt: contact.reminderAt || undefined,
    });

    setContact({ date: "", time: "", channel: "", summary: "", nextAction: "", reminderAt: "", assignedTo: "" });
    setShowContactForm(false);
  };

  const [enrolling] = useState(false);
  const params = useSearchParams();
  const aspiranteId = Number(params.get("idAspirante"));
  const [students, setStudents] = React.useState<StudentItem[] | null>(null);
  const [grupos, setGrupos] = React.useState<GroupItem[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalInitial, setModalInitial] = React.useState<any | undefined>(undefined);

  const fetchStudents = async () => {
    const students = await inscriptionsService.getStudents();
    setStudents(students.items);
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const openInscripcionModal = () => {
    setModalInitial({ idEstudiante: Number(item.id) });
    setIsModalOpen(true);
  };

  const fetchGrupos = async () => {
    const groups = await getGroups();
    setGrupos(groups?.items ?? []);
  }

  React.useEffect(() => {
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (!timeline || timeline.length === 0) return;
    const check = () => {
      const now = Date.now();
      timeline.forEach((t) => {
        if (t.reminderAt) {
          const ts = new Date(t.reminderAt).getTime();
          if (!isNaN(ts) && ts <= now) {
            try {
              updateEntry(t.id, { reminderAt: null });
            } catch { }
            // eslint-disable-next-line no-alert
            alert(`Recordatorio: ${t.summary ?? 'Contacto programado'} para ${t.assignedTo ?? 'responsable no asignado'}`);
          }
        }
      });
    };
    const id = window.setInterval(check, 10 * 1000);
    check();
    return () => window.clearInterval(id);
  }, [timeline, updateEntry]);

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm">
      {/* Línea superior: Nombre + chip Asignado a + Limpiar */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="truncate text-lg font-semibold">
            {item.nombreCompleto || "—"}
          </h2>
          <p className="text-xs text-gray-500">
            {item.correo || "Sin correo"} • {item.telefono || "Sin teléfono"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border bg-white px-3 py-1 text-xs text-gray-700">
            <span className="font-medium">Asignado a:</span>{' '}
            <span className="ml-1">{assignedTo || '—'}</span>
          </div>
          <button
            className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
            onClick={() => {
              const name = prompt('Asignar responsable (nombre):', assignedTo || '');
              setAssignedTo(name || null);
            }}
          >
            Editar
          </button>
          {assignedTo && (
            <button
              className="rounded-lg border px-2 py-1 text-xs text-red-600 hover:bg-gray-50"
              onClick={() => setAssignedTo(null)}
            >
              Quitar
            </button>
          )}
          <button
            onClick={onClear}
            className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabs: solo Resumen */}
      <div className="mb-3 flex gap-2">
        <button className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Resumen
        </button>
      </div>

      {/* Contenido Resumen */}
      <div className="space-y-4">
        {/* Tarjetas: Contactos + Programa de interés */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Contactos" value={stats.contacts} />
          <Stat label="Programa de interés" value={programName} />
        </div>

        {/* Básicos */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Registro</p>
            <p className="font-medium">{fmtDate(item.fechaRegistro)}</p>
          </div>
          <div>
            <p className="text-gray-500">Estatus</p>
            <p className="font-medium">{item.estatus || "—"}</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/list/admissions/${item.id}`}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Ver expediente
            </Link>
            <button
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => setShowContactForm((s) => !s)}
            >
              {showContactForm ? "Ocultar" : "Registrar contacto"}
            </button>
          </div>

          <button
            className="ml-auto rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            onClick={openInscripcionModal}
            disabled={enrolling}
          >
            {enrolling ? "Inscribiendo…" : "Inscribir"}
          </button>
        </div>

        <Timeline items={timeline} onRemove={(id) => removeEntry(id)} onUpdate={(id, patch) => updateEntry(id, patch)} />

        {/* Formulario de contacto */}
        {showContactForm && (
          <form
            className="space-y-3 rounded-2xl border border-blue-200/70 bg-blue-50/60 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              guardarContacto();
            }}
          >
            <p className="text-sm font-semibold text-blue-800">
              Registrar contacto
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={contact.date}
                  onChange={(e) =>
                    setContact((s) => ({ ...s, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={contact.time}
                  onChange={(e) =>
                    setContact((s) => ({ ...s, time: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Medio</Label>
              <Input
                placeholder="Teléfono, WhatsApp, Email…"
                value={contact.channel}
                onChange={(e) =>
                  setContact((s) => ({ ...s, channel: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Resumen breve de la conversación (se guarda como nota)</Label>
              <Textarea
                placeholder="Ej. Preguntó por becas; enviar requisitos"
                value={contact.summary}
                onChange={(e) =>
                  setContact((s) => ({ ...s, summary: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Próxima acción</Label>
              <Input
                placeholder="Ej. Enviar requisitos, agendar entrevista"
                value={contact.nextAction}
                onChange={(e) =>
                  setContact((s) => ({ ...s, nextAction: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Asignado (para este contacto)</Label>
                <Input
                  placeholder="Nombre responsable"
                  value={contact.assignedTo}
                  onChange={(e) => setContact((s) => ({ ...s, assignedTo: e.target.value }))}
                />
              </div>
              <div>
                <Label>Recordatorio</Label>
                <Input
                  type="datetime-local"
                  value={contact.reminderAt}
                  onChange={(e) => setContact((s) => ({ ...s, reminderAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => setShowContactForm(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Guardar contacto
              </button>
            </div>
          </form>
        )}

        <InscripcionModal open={isModalOpen} students={students ?? []} grupos={grupos} onClose={() => setIsModalOpen(false)} initial={modalInitial} />

      </div>
    </div>
  );
}

export default function AdmissionsDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("idAspirante") || "";

  const { admissions, error, getAdmissionById, loading } = useAdmisiones();

  const [selected, setSelected] = useState<LocalAdmission | null>(null);
  const [aspirante, setAspirante] = useState<AdmisionItem | null>(null);

  const [stats, setStats] = useState<Stats>({
    contacts: 0,
    notes: 0,
    tasksOpen: 0,
  });

  useEffect(() => {
    if (!selectedId || !admissions) return;

    const found = (admissions as AdmisionItem[]).find(
      (a) => String(a.idAspirante ?? a.personaId ?? "") === String(selectedId)
    );

    if (!found) {
      setSelected(null);
      return;
    }

    const mapped: LocalAdmission = {
      id: found.idAspirante ?? found.personaId,
      nombreCompleto: found.nombreCompleto,
      correo: (found as any).email ?? null,
      telefono: undefined,
      estatus: (found as any).aspiranteEstatus ?? null,
      fechaRegistro: found.fechaRegistro ?? null,
      programaNombre: (found as any).planEstudios ?? null,
      nivelNombre: undefined,
    };

    setSelected(mapped);
    setStats({ contacts: 0, notes: 0, tasksOpen: 0 });
  }, [selectedId, admissions]);

  useEffect(() => {
    if (!selectedId) return;
    if ((admissions == null || admissions.length === 0) && !loading) {
      getAdmissionById(Number(selectedId)).then((data: AdmisionItem | null) => {
        if (!data) {
          setSelected(null);
          return;
        }
        const mapped: LocalAdmission = {
          id: data.personaId,
          nombreCompleto: data.nombreCompleto ?? '',
          correo: (data as any)?.email ?? null,
          telefono: undefined,
          estatus: (data as any)?.aspiranteEstatus ?? null,
          fechaRegistro: (data as any)?.fechaRegistro ?? null,
          programaNombre: (data as any)?.planEstudios ?? null,
          nivelNombre: undefined,
        };

        setSelected(mapped);

      }).catch(() => { });
    }
  }, [selectedId, admissions, getAdmissionById, loading]);

  const header = useMemo(
    () => (
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Seguimiento de Aspirantes</h1>
        <p className="text-sm text-gray-500">
          Selecciona un aspirante para ver su información y registrar contactos.
        </p>
      </header>
    ),
    []
  );

  const clearSelection = useCallback(() => {
    setSelected(null);
    setStats({ contacts: 0, notes: 0, tasksOpen: 0 });
    const qs = new URLSearchParams(searchParams.toString());
    qs.delete("selected");
    router.replace(
      `/dashboard/list/admissions/detailsapplicants${qs.toString() ? `?${qs.toString()}` : ""
      }`
    );
  }, [router, searchParams]);

  return (
    <div className="w-auto pl-2">
      {header}

      <Callout />

      {error && (
        <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
          Error al cargar las admisiones: {String(error)}
        </div>
      )}

      {!selectedId ? (
        <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 rounded-2xl bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Sin selección
          </div>
          <h3 className="mb-1 text-lg font-semibold">Selecciona un aspirante</h3>
          <p className="max-w-sm text-sm text-gray-500">
            Desde la página de Admisiones, da doble-click en un aspirante para
            abrir su seguimiento aquí.
          </p>
          <Link
            href="/dashboard/list/admissions"
            className="mt-4 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Ir a Admisiones
          </Link>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Cargando aspirante…</p>
        </div>
      ) : !selected ? (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <p className="text-sm text-yellow-800">
            No se encontró el aspirante con id <b>{selectedId}</b>. Verifica que
            existe en la lista de Admisiones.
          </p>
          <Link
            href="/dashboard/list/admissions"
            className="mt-3 inline-block rounded-lg border px-3 py-2 text-sm hover:bg-yellow-100"
          >
            Volver a Admisiones
          </Link>
        </div>
      ) : (
        <DetailPanel item={selected} stats={stats} onClear={clearSelection} />
      )}
    </div>
  );
}
