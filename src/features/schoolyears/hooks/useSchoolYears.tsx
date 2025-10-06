"use client";

import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/schoolYearsService';
import type { SchoolYearItem, CreateSchoolYearPayload, UpdateSchoolYearPayload } from '../types';

export function useSchoolYears() {
  const [data, setData] = useState<SchoolYearItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await svc.getSchoolYears()) as SchoolYearItem[];
      setData(res || []);
    } catch (e) {
      setError((e as Error).message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: CreateSchoolYearPayload) => {
    setLoading(true);
    try {
      const n = (await svc.createSchoolYear(payload)) as SchoolYearItem;
      setData((prev) => [n, ...(prev || [])] as SchoolYearItem[]);
      return n;
    } finally { setLoading(false); }
  };

  const update = async (payload: UpdateSchoolYearPayload) => {
    setLoading(true);
    try {
      const u = (await svc.updateSchoolYear(payload)) as SchoolYearItem;
      setData((prev) => ((prev || []) as SchoolYearItem[]).map((p) => p.idSchoolYear === u.idSchoolYear ? u : p));
      return u;
    } finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    setLoading(true);
    try {
      await svc.deleteSchoolYear(id);
      setData((prev) => (prev || []).filter((p) => p.idSchoolYear !== id));
    } finally { setLoading(false); }
  };

  return { data, loading, error, fetch, create, update, remove };
}
