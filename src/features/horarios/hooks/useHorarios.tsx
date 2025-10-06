"use client";

import { useState, useEffect, useCallback } from 'react';
import * as svc from '@/features/horarios/Services/horariosService';
import type { HorarioItem, CreateHorarioPayload, UpdateHorarioPayload } from '../types';

export function useHorarios() {
  const [data, setData] = useState<HorarioItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await svc.getHorarios()) as HorarioItem[];
      setData(res || []);
    } catch (e) {
      setError((e as Error).message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: CreateHorarioPayload) => {
    setLoading(true);
    try {
      const n = (await svc.createHorario(payload)) as HorarioItem;
      setData((prev) => [n, ...(prev || [])] as HorarioItem[]);
      return n;
    } finally { setLoading(false); }
  };

  const update = async (payload: UpdateHorarioPayload) => {
    setLoading(true);
    try {
      const u = (await svc.updateHorario(payload)) as HorarioItem;
      setData((prev) => ((prev || []) as HorarioItem[]).map((p) => p.idHorario === u.idHorario ? u : p));
      return u;
    } finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    setLoading(true);
    try {
      await svc.deleteHorario(id);
      setData((prev) => (prev || []).filter((p) => p.idHorario !== id));
    } finally { setLoading(false); }
  };

  return { data, loading, error, fetch, create, update, remove };
}
