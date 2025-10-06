// app/dashboard/list/admissions/AdmissionsToolbarClient.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
//import { AdmissionFormModal } from "@/app/dashboard/list/admissions/AdmissionFormModal";
import { apiFetch } from "@/lib/fetcher";

// Tipos reales que consume tu modal
import type { EstadoItem } from "@/features/location/types";
import type { EstadoCivil } from "@/features/admisiones/types/Admisiones";
import type { PlanEstudiosItem } from "@/features/planestudios/types/PlanEstudiosItem";
import type { PeriodoAcademicoItem } from "@/features/periodoacademico/Types/PeriodoAcademicoItems";
import type { CampusItem } from "@/features/campus/types/CampusItem";
import type { NivelEducativoItem } from "@/features/niveleducativo/types/NivelEducativoItems";
import type { EstatusAspiranteItem } from "@/features/estatusaspirante/types/EstatusAspiranteItem";
import type { MedioContactoItem } from "@/features/mediocontacto/types/mediocontactoItem";
import type { HorariosItem } from "@/features/horarios/types/horariosItem";
import type { CrearAdmision } from "@/features/admisiones/types/CrearAdmision";
import { AdmissionFormModal } from "@/features/admisiones/components";



const ENDPOINTS = {
  estados: "/Ubicacion/estados",
  estadosCiviles: "/Admisiones/estados-civiles",
  planes: "/PlanEstudios",
  periodos: "/PeriodoAcademico",
  campus: "/Campus",
  niveles: "/NivelEducativo",
  estatusAspirante: "/Aspirantes/estatus",
  mediosContacto: "/MedioContacto",
  horarios: "/Horarios",
} as const;

export function AdmissionsToolbarClient() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);

    router.refresh();
  };


  const [estados, setEstados] = useState<EstadoItem[]>([]);
  const [estadosCiviles, setEstadosCiviles] = useState<EstadoCivil[]>([]);
  const [planes, setPlanes] = useState<PlanEstudiosItem[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoAcademicoItem[]>([]);
  const [campus, setCampus] = useState<CampusItem[]>([]);
  const [niveles, setNiveles] = useState<NivelEducativoItem[]>([]);
  const [estatus, setEstatus] = useState<EstatusAspiranteItem[]>([]);
  const [medios, setMedios] = useState<MedioContactoItem[]>([]);
  const [horarios, setHorarios] = useState<HorariosItem[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        setLoadingCatalogs(true);
        setCatalogError(null);

        const [
          estadosR,
          estadosCivilesR,
          planesR,
          periodosR,
          campusR,
          nivelesR,
          estatusR,
          mediosR,
          horariosR,
        ] = await Promise.all([
          apiFetch<EstadoItem[]>(ENDPOINTS.estados, { signal: controller.signal }),
          apiFetch<EstadoCivil[]>(ENDPOINTS.estadosCiviles, { signal: controller.signal }),
          apiFetch<PlanEstudiosItem[]>(ENDPOINTS.planes, { signal: controller.signal }),
          apiFetch<PeriodoAcademicoItem[]>(ENDPOINTS.periodos, { signal: controller.signal }),
          apiFetch<CampusItem[]>(ENDPOINTS.campus, { signal: controller.signal }),
          apiFetch<NivelEducativoItem[]>(ENDPOINTS.niveles, { signal: controller.signal }),
          apiFetch<EstatusAspiranteItem[]>(ENDPOINTS.estatusAspirante, { signal: controller.signal }),
          apiFetch<MedioContactoItem[]>(ENDPOINTS.mediosContacto, { signal: controller.signal }),
          apiFetch<HorariosItem[]>(ENDPOINTS.horarios, { signal: controller.signal }),
        ]);

        if (!mounted) return;

        setEstados(estadosR ?? []);
        setEstadosCiviles(estadosCivilesR ?? []);
        setPlanes(planesR ?? []);
        setPeriodos(periodosR ?? []);
        setCampus(campusR ?? []);
        setNiveles(nivelesR ?? []);
        setEstatus(estatusR ?? []);
        setMedios(mediosR ?? []);
        setHorarios(horariosR ?? []);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.name !== "AbortError") {
          setCatalogError(err?.message ?? "No se pudieron cargar los catálogos");
        }
      } finally {
        mounted && setLoadingCatalogs(false);
      }
    })();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const noopSubmit = async (_: CrearAdmision) => {};

  const modalCatalogProps = useMemo(
    () => ({
      EstadosItem: estados,
      EstadosCivilItems: estadosCiviles,
      PlanEstudiosItem: planes,
      PeriodoAcademicoItem: periodos,
      CampusItem: campus,
      NivelEducativoItem: niveles,
      EstatusAspiranteItem: estatus,
      MedioContactoItem: medios,
      HorariosItem: horarios,
    }),
    [estados, estadosCiviles, planes, periodos, campus, niveles, estatus, medios, horarios]
  );

  return (
    <>
      {/* Botón con estilo discreto, consistente con tu header */}
      <Button
        onClick={onOpen}
        className="h-9 px-3 rounded-lg gap-2 shadow-sm"
        disabled={loadingCatalogs}
      >
        <Plus className="h-4 w-4" />
        {loadingCatalogs ? "Cargando..." : "Nuevo aspirante"}
      </Button>

      {/* Modal full-screen con tus estilos existentes */}
      <AdmissionFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={noopSubmit}
        isSubmitting={false}
        {...modalCatalogProps}
      />

      {/* Mensaje fino si falla la hidración (mismo tono de tu UI) */}
      {catalogError ? (
        <p className="mt-2 text-xs text-red-600">{catalogError}</p>
      ) : null}
    </>
  );
}
