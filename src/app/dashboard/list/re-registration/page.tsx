"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* =========================
 *  Tipos
 * ========================= */
type Persona = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
};

type Estudiante = {
  id: string;
  persona: Persona;
  matricula?: string | null;
};

type Programa = { id: string; nombre: string };
type Plan = { id: string; nombre: string };

type CandidatoReinscripcion = {
  id: string; // id del candidato/registro “reinscripción pendiente”
  estudiante: Estudiante;
  programa: Programa;
  plan: Plan;
  periodoActual: string; // ej. "2025-1"
  periodoSugerido: string; // ej. "2025-2"
  estatus: "Elegible" | "Pendiente" | "Bloqueado";
  adeudo?: number;
  promedio?: number;
};

type Paginated<T> = {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

/* =========================
 *  Utilidades
 * ========================= */
const DEFAULT_AVATAR = "/avatars/avatar-generico.png";

function nombreCompleto(p: Persona) {
  return `${p.nombre ?? ""} ${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
}

function currency(n?: number) {
  if (n === undefined || n === null) return "—";
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function badgeByStatus(s: CandidatoReinscripcion["estatus"]) {
  const v = s.toLowerCase();
  if (v.includes("eleg")) return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (v.includes("pend")) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  return "bg-rose-50 text-rose-700 ring-rose-600/20"; // Bloqueado
}

function AvatarFoto({
  src,
  alt,
  size = 36,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = React.useState(src && src.trim() ? src : DEFAULT_AVATAR);
  return (
    <div
      className="shrink-0 rounded-full overflow-hidden bg-gray-100"
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        onError={() => setImgSrc(DEFAULT_AVATAR)}
      />
    </div>
  );
}

/* =========================
 *  Datos demo (fallback)
 * ========================= */
const DEMO: Paginated<CandidatoReinscripcion> = {
  items: [
    {
      id: "r1",
      estudiante: {
        id: "e1",
        persona: { id: "p1", nombre: "María Fernanda", apellidoPaterno: "Lopez", apellidoMaterno: "Ramos" },
        matricula: "A0123456",
      },
      programa: { id: "prog1", nombre: "Lic. Enfermería" },
      plan: { id: "pl1", nombre: "Plan 2022" },
      periodoActual: "2025-1",
      periodoSugerido: "2025-2",
      estatus: "Elegible",
      adeudo: 0,
      promedio: 8.7,
    },
    {
      id: "r2",
      estudiante: {
        id: "e2",
        persona: { id: "p2", nombre: "Luis", apellidoPaterno: "Hernández", apellidoMaterno: "Mora" },
        matricula: "A0123890",
      },
      programa: { id: "prog2", nombre: "Ing. Sistemas" },
      plan: { id: "pl2", nombre: "Plan 2021" },
      periodoActual: "2025-1",
      periodoSugerido: "2025-2",
      estatus: "Pendiente",
      adeudo: 850,
      promedio: 7.9,
    },
    {
      id: "r3",
      estudiante: {
        id: "e3",
        persona: { id: "p3", nombre: "Sofía", apellidoPaterno: "Nava", apellidoMaterno: "Torres" },
        matricula: "A0098765",
      },
      programa: { id: "prog3", nombre: "Lic. Psicología" },
      plan: { id: "pl3", nombre: "Plan 2020" },
      periodoActual: "2025-1",
      periodoSugerido: "2025-2",
      estatus: "Bloqueado",
      adeudo: 3200,
      promedio: 6.3,
    },
  ],
  totalItems: 3,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 1,
};

/* =========================
 *  Cliente API (ajusta a tu backend)
 * ========================= */
async function fetchReinscripciones(params: {
  q?: string;
  periodoActual?: string;
  periodoNuevo?: string;
  estatus?: "" | "Elegible" | "Pendiente" | "Bloqueado";
  page?: number;
  pageSize?: number;
}): Promise<Paginated<CandidatoReinscripcion>> {
  const url = new URL(
    "/api/reinscripciones",
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  );
  if (params.q) url.searchParams.set("q", params.q);
  if (params.periodoActual) url.searchParams.set("periodoActual", params.periodoActual);
  if (params.periodoNuevo) url.searchParams.set("periodoNuevo", params.periodoNuevo);
  if (params.estatus) url.searchParams.set("estatus", params.estatus);
  url.searchParams.set("page", String(params.page ?? 1));
  url.searchParams.set("pageSize", String(params.pageSize ?? 20));

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/* =========================
 *  Hook de datos
 * ========================= */
function useReinscripciones() {
  const [q, setQ] = React.useState("");
  const [periodoActual, setPeriodoActual] = React.useState("2025-1");
  const [periodoNuevo, setPeriodoNuevo] = React.useState("2025-2");
  const [estatus, setEstatus] = React.useState<"" | "Elegible" | "Pendiente" | "Bloqueado">("");

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const [data, setData] = React.useState<Paginated<CandidatoReinscripcion> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const d = await fetchReinscripciones({ q, periodoActual, periodoNuevo, estatus, page, pageSize });
      setData(d);
    } catch {
      // Fallback demo
      setData(DEMO);
    } finally {
      setLoading(false);
    }
  }, [q, periodoActual, periodoNuevo, estatus, page, pageSize]);

  React.useEffect(() => {
    load();
  }, [load]);

  return {
    q,
    setQ,
    periodoActual,
    setPeriodoActual,
    periodoNuevo,
    setPeriodoNuevo,
    estatus,
    setEstatus,
    page,
    setPage,
    pageSize,
    setPageSize,
    data,
    loading,
    reload: load,
  };
}

/* =========================
 *  Página
 * ========================= */
export default function Page() {
  const router = useRouter();
  const {
    q,
    setQ,
    periodoActual,
    setPeriodoActual,
    periodoNuevo,
    setPeriodoNuevo,
    estatus,
    setEstatus,
    pageSize,
    setPageSize,
    data,
    loading,
  } = useReinscripciones();

  // Selección por checkboxes
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const allVisibleIds = React.useMemo(() => (data?.items ?? []).map((x) => x.id), [data]);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (allSelected) {
        allVisibleIds.forEach((id) => n.delete(id));
      } else {
        allVisibleIds.forEach((id) => n.add(id));
      }
      return n;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const selectedCount = selectedIds.size;

  const handleBulkReEnroll = () => {
    if (!selectedCount) return;
    const ids = Array.from(selectedIds).join(",");
    router.push(
      `/dashboard/enrollments/re/nueva?ids=${encodeURIComponent(ids)}&periodoNuevo=${encodeURIComponent(
        periodoNuevo
      )}`
    );
  };

  return (
    <div className="w-auto px-6 py-6">
      {/* Cabecera */}
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reinscripciones</h1>
          <p className="text-sm text-gray-500">
            Selecciona alumnos elegibles y procesa su reinscripción al período destino.
          </p>
        </div>

        <button
          onClick={handleBulkReEnroll}
          disabled={selectedCount === 0}
          className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
            selectedCount === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          title={selectedCount === 0 ? "Selecciona al menos uno" : `Reinscribir ${selectedCount} seleccionado(s)`}
        >
          Reinscribir seleccionados{selectedCount ? ` (${selectedCount})` : ""}
        </button>
      </header>

      {/* Filtros */}
      <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, matrícula, programa…"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
          />
        </div>

        <select
          value={periodoActual}
          onChange={(e) => setPeriodoActual(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="2025-1">Período actual: 2025-1</option>
          <option value="2024-2">Período actual: 2024-2</option>
        </select>

        <select
          value={periodoNuevo}
          onChange={(e) => setPeriodoNuevo(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="2025-2">Período nuevo: 2025-2</option>
          <option value="2026-1">Período nuevo: 2026-1</option>
        </select>

        <select
          value={estatus}
          onChange={(e) => setEstatus(e.target.value as "" | "Elegible" | "Pendiente" | "Bloqueado")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos los estatus</option>
          <option value="Elegible">Elegible</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Bloqueado">Bloqueado</option>
        </select>

        {/* Tamaño de página */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Por página</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) {
                setPageSize(n);
                // Si tu API pagina realmente, probablemente quieras:
                // setPage(1);
              }
            }}
            className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4 overflow-visible">
        {loading && <p className="px-3 py-4 text-sm text-gray-500">Cargando…</p>}
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full table-auto">
            {/* col widths: [44, 360, auto, 160, 120, 120, 120, 120, 110] */}
            <colgroup><col className="w-[44px]" /><col className="w-[360px]" /><col /><col className="w-[160px]" /><col className="w-[120px]" /><col className="w-[120px]" /><col className="w-[120px]" /><col className="w-[120px]" /><col className="w-[110px]" /></colgroup>
            <thead className="text-left text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-2">Estudiante</th>
                <th className="px-3 py-2">Programa</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Período actual</th>
                <th className="px-3 py-2">Período nuevo</th>
                <th className="px-3 py-2">Estatus</th>
                <th className="px-3 py-2">Adeudo</th>
                <th className="px-3 py-2">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {(data?.items ?? []).map((r) => {
                const nombre = nombreCompleto(r.estudiante.persona);
                const checked = selectedIds.has(r.id);
                const badgeCls = badgeByStatus(r.estatus);
                return (
                  <tr key={r.id} className="align-top">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={checked}
                        onChange={() => toggleOne(r.id)}
                        aria-label={`Seleccionar ${nombre || r.estudiante.id}`}
                      />
                    </td>

                    {/* Estudiante */}
                    <td className="px-3 py-3 min-w-0">
                      <div className="flex items-start gap-3 min-w-0">
                        <AvatarFoto src={undefined} alt={nombre || r.estudiante.id} />
                        <div className="min-w-0">
                          <p className="font-medium leading-5 break-words">{nombre || "—"}</p>
                          <p className="text-xs text-gray-500">Matrícula: {r.estudiante.matricula ?? "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Programa */}
                    <td className="px-3 py-3">
                      <p className="font-medium">{r.programa?.nombre ?? "—"}</p>
                    </td>

                    {/* Plan */}
                    <td className="px-3 py-3">
                      <p>{r.plan?.nombre ?? "—"}</p>
                    </td>

                    {/* Periodos */}
                    <td className="px-3 py-3">{r.periodoActual}</td>
                    <td className="px-3 py-3">{periodoNuevo || r.periodoSugerido}</td>

                    {/* Estatus */}
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeCls}`}
                      >
                        {r.estatus}
                      </span>
                    </td>

                    {/* Adeudo */}
                    <td className="px-3 py-3">{currency(r.adeudo)}</td>

                    {/* Promedio */}
                    <td className="px-3 py-3">{r.promedio ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!data?.items || data.items.length === 0) && !loading && (
            <div className="px-3 py-10 text-center text-sm text-gray-500">
              No hay candidatos para reinscripción con los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Paginación (visual) */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página <strong>{data?.pageNumber ?? 1}</strong> de <strong>{data?.totalPages ?? 1}</strong> ·{" "}
            {data ? data.totalItems : 0} registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                /* implementa si tu API lo soporta */
              }}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              « Anterior
            </button>
            <button
              onClick={() => {
                /* implementa si tu API lo soporta */
              }}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Siguiente »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
