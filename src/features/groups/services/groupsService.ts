import { apiFetch } from "@/lib/fetcher";
import type { CreateGroupPayload, GroupData, GroupItem, UpdateGroupPayload } from "../types";

export async function getGroups(page = 1, pageSize = 20): Promise<GroupData | undefined> {
  return await apiFetch<GroupData>(`/grupos?page=${page}&pageSize=${pageSize}`);
}

export async function createGroup(data: CreateGroupPayload): Promise<GroupItem | undefined> {
  const created = await apiFetch<GroupItem>(`/grupos`, { method: "POST", body: JSON.stringify(data) });
  return created;
}

export async function updateGroup(data: UpdateGroupPayload): Promise<GroupItem | undefined> {
  const updated = await apiFetch<GroupItem>(`/grupos`, { method: "PUT", body: JSON.stringify(data) });
  return updated;
}

export async function deleteGroup(id: number | string) {
  await apiFetch(`/grupos/${id}`, { method: "DELETE" });
  return;
}
