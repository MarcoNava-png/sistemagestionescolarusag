'use client';

import * as React from 'react';

export type Persona = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento?: string | null;
  estatus?: string | null;
  personaGenero?: string | null;
};

export type Estudiante = {
  id: string;
  persona: Persona;
};

export type Programa = { id: string; nombre: string };
export type Plan = { id: string; nombre: string };

export type Inscripcion = {
  id: string;
  estudiante: Estudiante;
  programa: Programa;
  plan?: Plan | null;
  periodo?: string | null;
  estatus?: string | null;
  fechaInscripcion?: string | null;
};

export type Paginated<T> = {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

const DEMO_BASE: Paginated<Inscripcion> = {
  items: [],
  totalItems: 0,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 1,
};

async function getInscripciones(params: {
  q?: string;
  status?: string;
  periodo?: string;
  page?: number;
  pageSize?: number;
}): Promise<Paginated<Inscripcion>> {
  const url = new URL('/api/inscripciones', typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  if (params.q) url.searchParams.set('q', params.q);
  if (params.status) url.searchParams.set('status', params.status);
  if (params.periodo) url.searchParams.set('periodo', params.periodo);
  url.searchParams.set('page', String(params.page ?? 1));
  url.searchParams.set('pageSize', String(params.pageSize ?? 20));

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export function useInscripciones() {
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState<string>('Pendiente');
  const [periodo, setPeriodo] = React.useState<string>('');
  const [soloHoy, setSoloHoy] = React.useState<boolean>(true);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [data, setData] = React.useState<Paginated<Inscripcion> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await getInscripciones({ q, status, periodo, page, pageSize });
      setData(d);
    } catch (e) {
      const todayIso = new Date().toISOString();
      setData({
        ...DEMO_BASE,
        items: DEMO_BASE.items.map((x) => ({ ...x, fechaInscripcion: todayIso, estatus: 'Pendiente' })),
      });
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [q, status, periodo, page, pageSize]);

  React.useEffect(() => {
    load();
  }, [load]);

  const next = () => setPage((p) => (data && p < data.totalPages ? p + 1 : p));
  const prev = () => setPage((p) => (p > 1 ? p - 1 : p));

  const itemsFiltrados = React.useMemo(() => {
    let items = data?.items ?? [];
    if (soloHoy) items = items.filter((i) => {
      if (!i.fechaInscripcion) return false;
      const d = new Date(i.fechaInscripcion);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    });
    return items;
  }, [data, soloHoy]);

  return {
    q, setQ,
    status, setStatus,
    periodo, setPeriodo,
    soloHoy, setSoloHoy,
    page, setPage,
    pageSize, setPageSize,
    data, itemsFiltrados,
    loading, error,
    next, prev,
    reload: load,
  };
}
