"use client";
import React, { JSX, useMemo, useState, type ReactNode } from "react";
import { Search, Users2, RefreshCw, ArrowRightLeft, Plus, Minus, Filter, type LucideIcon } from "lucide-react";

// ===== Tipos =====
export type Accion = "alta" | "baja" | "modificacion";
export type Orden = "recientes" | "antiguos" | "alfabetico";

export interface Row {
  id: number;
  fecha: string; // YYYY-MM-DD
  usuario: string;
  accion: Accion;
  grupoAnterior: string | null;
  grupoNuevo: string | null;
  detalle?: string;
}

// ===== Dataset hardcodeado (ejemplo) =====
const DATA: Row[] = [
  {
    id: 1,
    fecha: "2025-09-20",
    usuario: "Valeria Hernández",
    accion: "modificacion",
    grupoAnterior: "Ingeniería en Sistemas - Grupo 501",
    grupoNuevo: "Ingeniería en Sistemas - Grupo 502",
    detalle: "Cambio de grupo por ajuste de horario (materia Cálculo Integral).",
  },
  {
    id: 2,
    fecha: "2025-09-18",
    usuario: "Carlos Ortega",
    accion: "alta",
    grupoAnterior: null,
    grupoNuevo: "Seminario de Titulación - Economía",
    detalle: "Inscripción tardía autorizada por coordinación académica.",
  },
];

// ===== Utilidades =====
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

const Tag: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-medium">
    {children}
  </span>
);

const Badge: React.FC<{ kind: Accion }> = ({ kind }) => {
  const map: Record<Accion, { icon: LucideIcon; label: string }> = {
    alta: { icon: Plus, label: "Alta" },
    baja: { icon: Minus, label: "Baja" },
    modificacion: { icon: ArrowRightLeft, label: "Modificación" },
  };
  const { icon: Icon, label } = map[kind];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
};

export default function ListadoCambiosGrupo(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [accion, setAccion] = useState<Accion | "todas">("todas");
  const [grupo, setGrupo] = useState<string>("todos");
  const [orden, setOrden] = useState<Orden>("recientes");

  const gruposUnicos: string[] = useMemo(() => {
    const set = new Set<string>();
    DATA.forEach((r) => {
      if (r.grupoAnterior) set.add(r.grupoAnterior);
      if (r.grupoNuevo) set.add(r.grupoNuevo);
    });
    return ["todos", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const dataFiltrada: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = DATA.filter((r) => {
      const matchTexto = !q
        ? true
        : [r.usuario, r.detalle ?? "", r.grupoAnterior ?? "", r.grupoNuevo ?? ""].some((v) =>
            String(v).toLowerCase().includes(q)
          );
      const matchAccion = accion === "todas" ? true : r.accion === accion;
      const matchGrupo =
        grupo === "todos" ? true : r.grupoAnterior === grupo || r.grupoNuevo === grupo;
      return matchTexto && matchAccion && matchGrupo;
    });

    rows.sort((a, b) => {
      if (orden === "recientes") return b.fecha.localeCompare(a.fecha);
      if (orden === "antiguos") return a.fecha.localeCompare(b.fecha);
      return a.usuario.localeCompare(b.usuario);
    });
    return rows;
  }, [query, accion, grupo, orden]);

  const resumen: { total: number } & Record<Accion, number> = useMemo(() => {
    const totales: Record<Accion, number> = dataFiltrada.reduce(
      (acc, r) => {
        acc[r.accion] = (acc[r.accion] ?? 0) + 1;
        return acc;
      },
      { alta: 0, baja: 0, modificacion: 0 }
    );
    return { total: dataFiltrada.length, ...totales };
  }, [dataFiltrada]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Users2 className="h-6 w-6" /> Cambios de grupo
        </h1>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <RefreshCw className="h-4 w-4" /> Datos hardcodeados de ejemplo
        </div>
      </header>

      {/* Controles */}
      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <div className="flex items-center gap-2 rounded-2xl border pl-3 pr-2 py-2">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por usuario, grupo o detalle…"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="sm:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-sm opacity-70"><Filter className="h-4 w-4"/>Filtros:</span>
            {/* Acción */}
            <select
              value={accion}
              onChange={(e) => setAccion(e.target.value as Accion | "todas")}
              className="rounded-2xl border px-3 py-2 text-sm"
            >
              <option value="todas">Todas las acciones</option>
              <option value="alta">Altas</option>
              <option value="baja">Bajas</option>
              <option value="modificacion">Modificaciones</option>
            </select>
            {/* Grupo */}
            <select
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="rounded-2xl border px-3 py-2 text-sm"
            >
              {gruposUnicos.map((g: string) => (
                <option key={g} value={g}>
                  {g === "todos" ? "Todos los grupos" : g}
                </option>
              ))}
            </select>
            {/* Orden */}
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="ml-auto rounded-2xl border px-3 py-2 text-sm"
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguos">Más antiguos primero</option>
              <option value="alfabetico">Orden alfabético (usuario)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Resumen */}
      <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Total</div>
          <div className="text-xl font-semibold">{resumen.total}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Altas</div>
          <div className="text-xl font-semibold">{resumen.alta}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Bajas</div>
          <div className="text-xl font-semibold">{resumen.baja}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Modificaciones</div>
          <div className="text-xl font-semibold">{resumen.modificacion}</div>
        </div>
      </section>

      {/* Lista */}
      <section className="grid grid-cols-1 gap-3">
        {dataFiltrada.map((r: Row) => (
          <article key={r.id} className="rounded-2xl border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge kind={r.accion} />
                  <Tag>{formatDate(r.fecha)}</Tag>
                </div>
                <h3 className="text-base font-semibold truncate">{r.usuario}</h3>
                <p className="mt-1 text-sm opacity-80">
                  {r.accion === "alta" && (
                    <>Alta en <strong>{r.grupoNuevo}</strong></>
                  )}
                  {r.accion === "baja" && (
                    <>Baja de <strong>{r.grupoAnterior}</strong></>
                  )}
                  {r.accion === "modificacion" && (
                    <>
                      {r.grupoAnterior ? <><strong>{r.grupoAnterior}</strong> → </> : null}
                      <strong>{r.grupoNuevo}</strong>
                    </>
                  )}
                </p>
                {r.detalle && (
                  <p className="mt-1 text-sm opacity-70 line-clamp-2">{r.detalle}</p>
                )}
              </div>
              <div className="text-right text-xs opacity-60 whitespace-nowrap">
                #{r.id}
              </div>
            </div>
          </article>
        ))}
        {dataFiltrada.length === 0 && (
          <div className="rounded-2xl border p-6 text-center text-sm opacity-70">
            No hay registros que coincidan con tu búsqueda.
          </div>
        )}
      </section>

      {/* Pie */}
      <footer className="mt-6 text-xs opacity-60">
        Sugerencia: reemplaza el array <code>DATA</code> con tus propios registros o conecta una API más adelante.
      </footer>
    </div>
  );
}
