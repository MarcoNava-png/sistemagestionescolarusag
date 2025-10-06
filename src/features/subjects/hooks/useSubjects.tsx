"use client";

import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/subjectsService';
import type { SubjectItem, CreateSubjectPayload, UpdateSubjectPayload } from '../types';

export function useSubjects() {
  const [data, setData] = useState<SubjectItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await svc.getSubjects()) as SubjectItem[];
      setData(res || []);
    } catch (e) {
      setError((e as Error).message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: CreateSubjectPayload) => {
    setLoading(true);
    try {
      const n = (await svc.createSubject(payload)) as SubjectItem;
      setData((prev) => [n, ...(prev || [])] as SubjectItem[]);
      return n;
    } finally { setLoading(false); }
  };

  const update = async (payload: UpdateSubjectPayload) => {
    setLoading(true);
    try {
      const u = (await svc.updateSubject(payload)) as SubjectItem;
      setData((prev) => ((prev || []) as SubjectItem[]).map((p) => p.idSubject === u.idSubject ? u : p));
      return u;
    } finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    setLoading(true);
    try {
      await svc.deleteSubject(id);
      setData((prev) => (prev || []).filter((p) => p.idSubject !== id));
    } finally { setLoading(false); }
  };

  return { data, loading, error, fetch, create, update, remove };
}
