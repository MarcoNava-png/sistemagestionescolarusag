"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInscripciones, Persona } from '@/features/inscriptions/useInscripciones';
import InscripcionesTable from '@/features/inscriptions/components/InscripcionesTable';
import { StudentItem } from '@/features/inscriptions/types';
import InscripcionModal from '@/features/inscriptions/components/InscripcionModal';
import { getStudents } from "@/features/inscriptions/services/inscriptionsService";
import { getGroups, GroupItem } from "@/features/groups";

function nombreCompleto(p: Persona) {
  return `${p.nombre ?? ""} ${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
}
function formatDate(d?: string | null) {
  if (!d) return "—";
  const dd = new Date(d);
  if (isNaN(dd.getTime())) return "—";
  return dd.toLocaleDateString("es-MX");
}

function badgeClassesByStatus(s?: string | null) {
  const v = (s ?? "").toLowerCase();
  if (v.includes("pend")) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  if (v.includes("cancel")) return "bg-rose-50 text-rose-700 ring-rose-600/20";
  if (v.includes("conclu") || v.includes("regist")) return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  return "bg-gray-50 text-gray-700 ring-gray-600/20";
}

export default function Page() {
  const router = useRouter();
  const {
    q, setQ,
    status, setStatus,
    periodo, setPeriodo,
    soloHoy, setSoloHoy,
    page, pageSize, setPageSize,
    data, itemsFiltrados, loading, error,
    next, prev,
  } = useInscripciones();

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (id: string) => selectedIds.has(id);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const [students, setStudents] = React.useState<StudentItem[] | null>(null);

  const fetchStudents = async () => {
    const students = await getStudents();
    setStudents(students.items);
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const allVisibleIds = React.useMemo(
    () => (itemsFiltrados ?? []).map((i) => i.id),
    [itemsFiltrados]
  );

  const allSelectedOnPage = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (allSelectedOnPage) {
        // deselecciona visibles
        allVisibleIds.forEach((id) => n.delete(id));
      } else {
        // selecciona visibles
        allVisibleIds.forEach((id) => n.add(id));
      }
      return n;
    });
  };

  const selectedCount = selectedIds.size;

  // Carga dinámica de jsPDF desde CDN para evitar agregar dependencia
  const loadJsPDF = React.useCallback(async () => {
    if (typeof window === 'undefined') return undefined as any;
    // Si ya está cargado
    if ((window as any).jspdf?.jsPDF) return (window as any).jspdf.jsPDF;
    await new Promise<void>((resolve, reject) => {
      const scriptId = 'jspdf-umd';
      if (document.getElementById(scriptId)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('No se pudo cargar jsPDF'));
      document.body.appendChild(s);
    });
    return (window as any).jspdf.jsPDF;
  }, []);

  const downloadSelectedPdf = React.useCallback(async () => {
    try {
      if (!itemsFiltrados || selectedIds.size !== 1) return;
      const [id] = Array.from(selectedIds);
      const ins = itemsFiltrados.find((it) => it.id === id);
      if (!ins) return;

      const jsPDF = await loadJsPDF();
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const left = 56; // 56pt ~ 0.78in margin
      let y = 72;

      // Título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Detalle de Inscripción', left, y);
      y += 24;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      const estudiante = nombreCompleto(ins.estudiante.persona);
      const programa = ins.programa?.nombre ?? '—';
      const plan = ins.plan?.nombre ?? '—';
      const periodoVal = ins.periodo ?? '—';
      const estatus = ins.estatus ?? '—';
      const fecha = formatDate(ins.fechaInscripcion);

      const lines: Array<[string, string]> = [
        ['ID inscripción', ins.id],
        ['Estudiante', estudiante || '—'],
        ['ID Estudiante', String(ins.estudiante.id ?? '—')],
        ['Programa', programa],
        ['Plan', plan],
        ['Período', periodoVal],
        ['Estatus', estatus],
        ['Fecha inscripción', fecha],
      ];

      const labelW = 140;
      const lineH = 18;
      lines.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, left, y);
        doc.setFont('helvetica', 'normal');
        const textX = left + labelW;
        // Ajuste simple de texto largo
        const splitted = doc.splitTextToSize(value ?? '—', 460);
        doc.text(splitted as any, textX, y);
        y += Array.isArray(splitted) ? lineH * (splitted.length || 1) : lineH;
      });

      y += 16;
      doc.setFont('helvetica', 'italic');
      doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, left, y);

      const fileName = `Inscripcion_${ins.id}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF error', err);
      alert('No se pudo generar el PDF.');
    }
  }, [itemsFiltrados, selectedIds, loadJsPDF, nombreCompleto, formatDate]);

  const handleBulkEnroll = () => {
    if (selectedCount === 0) return;
    const ids = Array.from(selectedIds).join(",");
    // Ajusta a tu ruta real de alta masiva:
    router.push(`/dashboard/list/Inscripciones/nueva?ids=${encodeURIComponent(ids)}`);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalInitial, setModalInitial] = React.useState<any | undefined>(undefined);
  const [grupos, setGrupos] = React.useState<GroupItem[]>([]);

  const openInscripcionModal = (idEstudiante?: string) => {
    setModalInitial({ idEstudiante: idEstudiante ? Number(idEstudiante) : 0 });
    setIsModalOpen(true);
  };

  const fetchGrupos = async () => {
    const groups = await getGroups();
    setGrupos(groups?.items ?? []);
  }

  React.useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <div className="w-auto px-6 py-6">
      {/* Cabecera */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inscripciones</h1>
          <p className="text-sm text-gray-500">
            Registros <strong>pendientes</strong> de <strong>hoy</strong> por defecto.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          {/* Botón masivo: Inscribir seleccionados */}
          <button
            onClick={handleBulkEnroll}
            disabled={selectedCount === 0}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
              selectedCount === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            title={selectedCount === 0 ? "Selecciona al menos uno" : `Inscribir ${selectedCount} seleccionados`}
          >
            Inscribir seleccionados{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>

          {/* Descargar PDF del seleccionado (exactamente 1) */}
          <button
            onClick={downloadSelectedPdf}
            disabled={selectedCount !== 1}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
              selectedCount !== 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title={selectedCount !== 1 ? 'Selecciona exactamente uno' : 'Descargar PDF de la inscripción seleccionada'}
          >
            Descargar PDF
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, programa, plan…"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los estatus</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Registrada">Registrada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Concluida">Concluida</option>
          </select>

          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los períodos</option>
            <option value="2025-1">2025-1</option>
            <option value="2025-2">2025-2</option>
            <option value="2026-1">2026-1</option>
          </select>

          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => setSoloHoy(true)}
              className={`px-3 py-2 text-sm ${soloHoy ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setSoloHoy(false)}
              className={`px-3 py-2 text-sm ${!soloHoy ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Paginación: tamaño */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Por página</label>
          <select
            value={pageSize}
            onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) setPageSize(n); }}
            className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4 overflow-visible">
        {loading && <p className="px-3 py-4 text-sm text-gray-500">Cargando…</p>}
        <InscripcionesTable
          items={itemsFiltrados ?? []}
          students={students ?? []}
          isSelected={isSelected}
          toggleOne={toggleOne}
          toggleAllVisible={toggleAllVisible}
          allSelectedOnPage={allSelectedOnPage}
          formatDate={formatDate}
          nombreCompleto={nombreCompleto}
          badgeClassesByStatus={badgeClassesByStatus}
          onInscribir={(id: string) => openInscripcionModal(id)}
        />

        <InscripcionModal open={isModalOpen} students={students ?? []} grupos={grupos} onClose={() => setIsModalOpen(false)} initial={modalInitial} />

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página <strong>{data?.pageNumber ?? 1}</strong> de{" "}
            <strong>{data?.totalPages ?? 1}</strong> · {data ? data.totalItems : 0} registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={!data || (data.pageNumber ?? 1) <= 1}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              « Anterior
            </button>
            <button
              onClick={next}
              disabled={!data || (data.pageNumber ?? 1) >= (data.totalPages ?? 1)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
