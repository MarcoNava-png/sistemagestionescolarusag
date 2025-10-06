'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/pagination';

import { useAdmisiones } from '@/features/admisiones/hooks/useAdmisiones';
import { AdmissionFormModal } from '@/features/admisiones/components/modals/AdmisionesFormModal';
import { AdmisionItem } from '../types/AdmisionesData';
import { CrearAdmision } from '../types/CrearAdmision';
import { getPlanEstudios } from '@/features/planestudios/Services/PlanEstudiosService';
import { PeriodoAcademicoItem } from '@/features/periodoacademico/Types/PeriodoAcademicoItems';
import { getPeriodoAcademico } from '@/features/periodoacademico/Services/PeriodoAcademicoService';
import { CampusItem } from '@/features/campus/types/CampusItem';
import { getCampus } from '@/features/campus/Services/CampusService';
import { getNivelEducativo } from '@/features/niveleducativo/Services/NivelEducativoService';
import { NivelEducativoItem } from '@/features/niveleducativo/types/NivelEducativoItems';
import { EstatusAspiranteItem } from '@/features/estatusaspirante/types/EstatusAspiranteItem';
import { getEstatusAspirante } from '@/features/estatusaspirante/Service/EstatusAspiranteService';
import { MedioContactoItem } from '@/features/mediocontacto/types/mediocontactoItem';
import { getMedioContacto } from '@/features/mediocontacto/Services/MedioContactoService';
import { HorariosItem } from '@/features/horarios/types/horariosItem';
import { getHorarios } from '@/features/horarios/Services/HoariosService';
import { PlanEstudiosItem } from '@/features/planestudios/types/PlanEstudiosItem';
import { PlanEstudiosData } from '@/features/planestudios/types/PlanEstudiosResponse';
import { apiFetch } from '@/lib/fetcher';
import { EstadoItem } from '@/features/location/types';
import { BitacoraModal } from '@/features/admisiones/components/modals/BitacoraModal';
import { estadosCiviles } from '../services/admisionesService';
import { EstadoCivil } from '../types/Admisiones';

export type AdmissionsListProps = {
  onRowDoubleClick?: (a: AdmisionItem) => void;
};

export function AdmissionsList({ onRowDoubleClick }: AdmissionsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(undefined);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [EstadosItems, setEstadosItems] = useState<EstadoItem[]>([]);
  const [EstadosCivilItems, setEstadosCivilItems] = useState<EstadoCivil[]>([]);
  const [isBitacoraOpen, setIsBitacoraOpen] = useState(false);
  const [selectedAspiranteId, setSelectedAspiranteId] = useState<number | null>(null);
  
  const [PlanEstudiosItems, setPlanEstudiosItems] = useState<PlanEstudiosItem[]>([]);
  const [PeriodoAcademicoItems, setPeriodoAcademicoItems] = useState<PeriodoAcademicoItem[]>([]);
  const [CampusItems, setCampusItems] = useState<CampusItem[]>([]);
  const [NivelEducativoItems, setNivelEducativoItems] = useState<NivelEducativoItem[]>([]);
  const [EstatusAspiranteItems, setEstatusAspiranteItems] = useState<EstatusAspiranteItem[]>([]);
  const [MedioContactoItems, setMedioContactoItems] = useState<MedioContactoItem[]>([]);
  const [HorariosItems, setHorariosItems] = useState<HorariosItem[]>([]);

  const {
    admissions,
    error,
    createAdmissionData,
    loading,
    fetchAdmissions,
    totalItems: serverTotalItems,
    pageNumber: serverPageNumber,
    pageSize: serverPageSize,
    totalPages: serverTotalPages,
  } = useAdmisiones();


  const fetchEstadosCivil = useCallback(async () => {
    try {
      const data: EstadoCivil[] = await estadosCiviles();
      setEstadosCivilItems(data)
    } finally {

    }
  }, []);

  const fetchEstados = useCallback(async () => {
    try {
      const data: EstadoItem[] = await apiFetch<EstadoItem[]>('/Ubicacion/estados');
      setEstadosItems(data)
    } finally {

    }
  }, []);

  useEffect(() => {
    fetchEstados()
    fetchEstadosCivil()
  }, [fetchEstados, fetchEstadosCivil])

  const fetchPlanEstudios = useCallback(async () => {
    try {
      const data: PlanEstudiosData = await getPlanEstudios();
      setPlanEstudiosItems(data.items)
    } finally {

    }
  }, []);

  useEffect(() => {
    fetchPlanEstudios()
  }, [fetchPlanEstudios])

  const fetchPeriodoAcademico = useCallback(async () => {
    try {
      const data = await getPeriodoAcademico();
      setPeriodoAcademicoItems(data.items)
    } catch (e: any) {

    } finally {

    }
  }, []);

  useEffect(() => {
    fetchPeriodoAcademico()
  }, [fetchPeriodoAcademico])

  const fetchCampus = useCallback(async () => {
    try {
      const data = await getCampus();
      setCampusItems(data.items)
    } finally {

    }
  }, []);

  useEffect(() => {
    fetchCampus()
  }, [fetchCampus])

  const fetchNivelEducativo = useCallback(async () => {
    try {
      const data = await getNivelEducativo();
      setNivelEducativoItems(data);
    } finally { }
  }, []);

  useEffect(() => {
    fetchNivelEducativo()
  }, [fetchNivelEducativo])

  const fetchEstatusAspirante = useCallback(async () => {
    try {
      const data = await getEstatusAspirante();
      setEstatusAspiranteItems(data);
    } catch (e: any) {
      console.error('Error fetching estatus aspirante:', e);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchEstatusAspirante()
  }, [fetchEstatusAspirante])

  const fetchMedioContacto = useCallback(async () => {
    try {
      const data = await getMedioContacto();
      setMedioContactoItems(data);
    } catch (e: any) {
      console.error('Error fetching medio contacto:', e);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchMedioContacto()
  }, [fetchMedioContacto])

  const fetchHorarios = useCallback(async () => {
    try {
      const data = await getHorarios();
      setHorariosItems(data);
    } catch (e: any) {
      console.error('Error fetching horarios:', e);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchHorarios()
  }, [fetchHorarios])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openBitacoraFor = (aspiranteId: number) => {
    setSelectedAspiranteId(aspiranteId);
    setIsBitacoraOpen(true);
  };

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim() || undefined);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const totalItems = serverTotalItems ?? (admissions?.length ?? 0);
  const totalPages = Math.max(1, serverTotalPages ?? Math.ceil(totalItems / (serverPageSize ?? pageSize)));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [totalPages]);

  useEffect(() => {
    fetchAdmissions(page, pageSize, debouncedSearch);
  }, [fetchAdmissions, page, pageSize, debouncedSearch]);

  useEffect(() => {
    if (serverPageNumber && serverPageNumber !== page) setPage(serverPageNumber);
    if (serverPageSize && serverPageSize !== pageSize) setPageSize(serverPageSize);
  }, [serverPageNumber, serverPageSize]);

  const pagedAdmissions = admissions ?? [];
  const currentPage = serverPageNumber ?? page;
  const currentPageSize = serverPageSize ?? pageSize;

  const handlePageClick = (p: number) => {
    if (p < 1) return;
    setPage(p);
    fetchAdmissions(p, currentPageSize, debouncedSearch);
  };

  const getInitial = (a: AdmisionItem) =>
    (a.nombreCompleto.trim()?.charAt(0)?.toUpperCase() || '?');

  const handleFormSubmit = async (data: CrearAdmision) => {
    try {
      await createAdmissionData(data);
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error saving admission:', error);
    }
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${m}/${y}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lista de Aspirantes <span className="text-sm text-gray-500 font-normal">({totalItems ?? 0})</span></h2>
        <Button
          type="button"
          onClick={() => setIsFormModalOpen(true)}
          className="bg-black text-white hover:bg-[#233f6a]"
          disabled={loading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Aspirante
        </Button>
      </div>

      <div className="w-full md:w-1/3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Buscar aspirantes</label>
          <input
            type="text"
            placeholder="Buscar por nombre, estatus, programa..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded-md p-2 text-sm ring-1 ring-gray-300"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Programa de interés</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(pagedAdmissions ?? []).map((a) => (
              <TableRow
                key={a.idAspirante}
                className="hover:bg-gray-50 cursor-default"
                onDoubleClick={() => onRowDoubleClick?.(a)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                      {getInitial(a)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {a.nombreCompleto || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {'Sin teléfono'}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-900">
                  {a.email || 'Sin email'}
                </TableCell>

                <TableCell className="text-sm text-gray-700">
                  {a.planEstudios ?? '—'}
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {a.aspiranteEstatus || '—'}
                  </span>
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                  {formatDate(a.fechaRegistro)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/list/admissions/detailsapplicants?selected=${a.idAspirante}`}
                    className="inline-block rounded-lg border px-3 py-1 text-xs text-blue-600 hover:bg-blue-50"
                  >
                    Seguimiento
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2 inline-block px-3 py-1 h-7 text-xs"
                    onClick={() => openBitacoraFor(a.idAspirante)}
                  >
                    Bitácora
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {loading && <div className="p-3 text-xs text-gray-500">Cargando...</div>}

        {!loading && (totalItems ?? 0) === 0 && (
          <div className="p-6 text-sm text-gray-500">No hay aspirantes todavía.</div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Mostrar</label>
          <select
            value={serverPageSize ?? pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              setPage(1);
              // fetch first page with new page size immediately
              try {
                fetchAdmissions(1, newSize, debouncedSearch);
              } catch (err) { }
            }}
            className="rounded-md border px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">registros</span>
        </div>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageClick(currentPage - 1)} />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                if (totalPages > 7) {
                  // show first, last, current +/-1 and ellipsis
                  if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => handlePageClick(p)}
                          isActive={p === currentPage}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  // insert ellipsis where appropriate
                  const prev = page - 2;
                  const next = page + 2;
                  if (p === prev || p === next) {
                    return <PaginationItem key={`ellipsis-${p}`}>
                      <PaginationEllipsis />
                    </PaginationItem>;
                  }
                  return null;
                }

                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => handlePageClick(p)}
                      isActive={p === currentPage}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext onClick={() => handlePageClick(currentPage + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {isFormModalOpen && (
        <AdmissionFormModal
          isOpen={isFormModalOpen}
          EstadosItem={EstadosItems}
          EstadosCivilItems={EstadosCivilItems}
          PlanEstudiosItem={PlanEstudiosItems}
          PeriodoAcademicoItem={PeriodoAcademicoItems}
          CampusItem={CampusItems}
          NivelEducativoItem={NivelEducativoItems}
          EstatusAspiranteItem={EstatusAspiranteItems}
          MedioContactoItem={MedioContactoItems}
          HorariosItem={HorariosItems}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {isBitacoraOpen && (
        <BitacoraModal
          open={isBitacoraOpen}
          onClose={() => setIsBitacoraOpen(false)}
          aspiranteId={selectedAspiranteId}
        />
      )}
    </div>
  );
}
