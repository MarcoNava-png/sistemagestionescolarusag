import { apiFetch } from "@/lib/fetcher";

export type RemoteTimelineItem = {
  id: string;
  date?: string | null;
  time?: string | null;
  channel?: string | null;
  summary?: string | null;
  nextAction?: string | null;
  assignedTo?: string | null;
  reminderAt?: string | null;
  createdAt: string;
};

export async function fetchTimeline(admissionId: number | string): Promise<RemoteTimelineItem[]> {
  // Try plausible endpoint; backend may use /Aspirante/{id}/contacts or /Aspirante/{id}/timeline
  try {
    return await apiFetch<RemoteTimelineItem[]>(`/Aspirante/${admissionId}/timeline`);
  } catch (e) {
    try {
      return await apiFetch<RemoteTimelineItem[]>(`/Aspirante/${admissionId}/contacts`);
    } catch (err) {
      throw e;
    }
  }
}

export async function createTimelineEntry(admissionId: number | string, payload: Partial<RemoteTimelineItem>) {
  return await apiFetch<RemoteTimelineItem>(`/Aspirante/${admissionId}/timeline`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTimelineEntry(admissionId: number | string, entryId: string, payload: Partial<RemoteTimelineItem>) {
  return await apiFetch<RemoteTimelineItem>(`/Aspirante/${admissionId}/timeline/${entryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTimelineEntry(admissionId: number | string, entryId: string) {
  return await apiFetch<void>(`/Aspirante/${admissionId}/timeline/${entryId}`, {
    method: "DELETE",
  });
}
