"use client";

import { conveniosMock } from "@/features/convenios/types/conveniosMock";

type Status = "Vigente" | "Por vencer" | "Expirado";

function fmtDate(s?: string) {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-MX");
}

function statusVigencia(inicio: string, fin: string): Status {
  const hoy = new Date();
  const fFin = new Date(fin);
  if (isNaN(fFin.getTime())) return "Expirado";
  const diff = Math.ceil((fFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  if (fFin < hoy) return "Expirado";
  if (diff <= 30) return "Por vencer";
  return "Vigente";
}

function badgeVigencia(status: Status) {
  switch (status) {
    case "Vigente":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "Por vencer":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    default:
      return "bg-gray-100 text-gray-700 ring-gray-600/10";
  }
}

function chipTipo(tipo: string) {
  const t = (tipo || "").toLowerCase();
  if (t.includes("beca")) return "bg-blue-50 text-blue-700 ring-blue-600/20";
  if (t.includes("servicio")) return "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/20";
  if (t.includes("bolsa")) return "bg-cyan-50 text-cyan-700 ring-cyan-600/20";
  return "bg-slate-50 text-slate-700 ring-slate-600/20";
}

export default function ConveniosPage() {
  return (
    <div className="px-4 py-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Convenios</h1>
          <p className="text-sm text-gray-500">Listado de convenios con instituciones y su vigencia.</p>
        </div>
        <a
          href="/dashboard/list/convenios/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          Nuevo convenio
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm">
        <div className="overflow-auto">
          <table className="min-w-[920px] w-full border-collapse text-sm">
            {/* THEAD sticky */}
            <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-medium">Convenio</th>
                <th className="px-4 py-3 font-medium">Institución</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Vigencia</th>
                <th className="px-4 py-3 font-medium">Beneficio</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Archivo</th>
                <th className="px-4 py-3 font-medium">Activo</th>
              </tr>
            </thead>

            <tbody className="[&>tr:hover]:bg-gray-50">
              {conveniosMock.map((c, idx) => {
                const estatus = statusVigencia(c.fechaInicio, c.fechaFin);
                return (
                  <tr
                    key={c.id}
                    className={`border-t border-gray-100 ${
                      idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
                    } transition-colors`}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-900">{c.nombre}</div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        #{c.id} • {fmtDate(c.fechaInicio)} – {fmtDate(c.fechaFin)}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="text-gray-800">{c.institucion}</div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${chipTipo(
                          c.tipo
                        )}`}
                      >
                        {c.tipo.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badgeVigencia(
                          estatus
                        )}`}
                      >
                        {estatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span className="text-gray-800">{c.beneficio ?? "—"}</span>
                    </td>

                    <td className="px-4 py-3 align-top">
                      {c.contactoNombre ? (
                        <div className="space-y-0.5">
                          <div className="font-medium text-gray-800">{c.contactoNombre}</div>
                          <div className="text-xs text-gray-500">
                            {c.contactoTelefono ? (
                              <a className="underline underline-offset-2 hover:text-gray-700" href={`tel:${c.contactoTelefono}`}>
                                {c.contactoTelefono}
                              </a>
                            ) : (
                              "—"
                            )}
                            {" · "}
                            {c.contactoEmail ? (
                              <a className="underline underline-offset-2 hover:text-gray-700" href={`mailto:${c.contactoEmail}`}>
                                {c.contactoEmail}
                              </a>
                            ) : (
                              "—"
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top">
                      {c.archivoUrl ? (
                        <a
                          className="inline-flex items-center gap-1 text-blue-700 underline underline-offset-2 hover:text-blue-800"
                          href={c.archivoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          PDF
                          <span aria-hidden>↗</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                          c.activo
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-gray-100 text-gray-700 ring-gray-600/10"
                        }`}
                      >
                        {c.activo ? "Sí" : "No"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <span>Total: {conveniosMock.length}</span>
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 ring-1 ring-emerald-600/20">Vigente</span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 ring-1 ring-amber-600/20">Por vencer</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 ring-1 ring-gray-600/10">Expirado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
