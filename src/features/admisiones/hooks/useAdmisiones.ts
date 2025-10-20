"use client";

import { useCallback, useRef, useState } from "react";
import { getAdmissions, createAdmission, getAdmissionByIdData } from "@/features/admisiones/services/admisionesService";
import { AdmisionItem } from "../types/AdmisionesData";
import { CrearAdmision } from "../types/CrearAdmision";

export function useAdmisiones() {
  const [admissions, setAdmissions] = useState<AdmisionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastSearch, setLastSearch] = useState<string | undefined>(undefined);

  const lastRequestedRef = useRef<{ page: number; pSize: number; search?: string } | null>(null);

  const fetchAdmissions = useCallback(async (page: number = 1, pSize: number = 20, search?: string, force: boolean = false) => {
    const sameAsLast: boolean | null = lastRequestedRef.current && lastRequestedRef.current.page === page && lastRequestedRef.current.pSize === pSize && (lastRequestedRef.current.search ?? undefined) === (search ?? undefined);
    if (sameAsLast && !force) {
      return;
    }

    lastRequestedRef.current = { page, pSize, search };
    try {
      setLoading(true);
      setError(null);
      const list = await getAdmissions(page, pSize, search);
      setAdmissions(list.items ?? []);
      setTotalItems(list.totalItems ?? (list.items?.length ?? 0));
      setPageNumber(list.pageNumber ?? page);
      setPageSize(list.pageSize ?? pSize);
      setTotalPages(list.totalPages ?? Math.max(1, Math.ceil((list.totalItems ?? (list.items?.length ?? 0)) / (list.pageSize ?? pSize))));
      setLastSearch(search);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar las admisiones");
    } finally {
      setLoading(false);
    }
  }, []);

  const admissionById = useCallback((id: number) => {
    return admissions.find(a => a.idAspirante === id);
  }, [admissions]);

  const getAdmissionById = useCallback(async (id: number) => {
    const data = await getAdmissionByIdData(id);
    return data;
  }, [admissions, getAdmissionByIdData]);

  const createAdmissionData = async (payload: CrearAdmision) => {
    try {
      setLoading(true);
      const response = await createAdmission(payload);

      if (!response || response.status !== 200) {
        throw new Error('Error al crear la admisión');
      }

      try {
        await fetchAdmissions(pageNumber, pageSize, lastSearch, true);
      } catch { }

    } catch (e: any) {
      setError(e?.message ?? "Error al crear la admisión");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { admissions, loading, error, fetchAdmissions, getAdmissionById, createAdmissionData, totalItems, pageNumber, pageSize, totalPages };
}
