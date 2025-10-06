"use client";

import * as React from "react";
import * as svc from "../services/groupsService";
import type { GroupItem, CreateGroupPayload, UpdateGroupPayload } from "../types";

export function useGroups(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [data, setData] = React.useState<{ items: GroupItem[]; totalItems: number; pageNumber: number; pageSize: number; totalPages: number } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await svc.getGroups(page, pageSize);
      setData(res as any);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  React.useEffect(() => { load(); }, [load]);

  const create = React.useCallback(async (payload: CreateGroupPayload) => {
    const created = await svc.createGroup(payload);
    await load();
    return created;
  }, [load]);

  const update = React.useCallback(async (payload: UpdateGroupPayload) => {
    const updated = await svc.updateGroup(payload);
    await load();
    return updated;
  }, [load]);

  const remove = React.useCallback(async (id: number | string) => {
    await svc.deleteGroup(id);
    await load();
  }, [load]);

  return { page, setPage, pageSize, setPageSize, data, loading, error, reload: load, create, update, remove };
}
