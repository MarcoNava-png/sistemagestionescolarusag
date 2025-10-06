"use client";

import { useCallback, useEffect, useState } from "react";
import * as timelineService from "@/features/admisiones/services/admissionTimelineService";

export type AdmissionTimelineItem = {
  id: string;
  date?: string;
  time?: string;
  channel?: string;
  summary?: string;
  nextAction?: string;
  // optional assigned person (username or id)
  assignedTo?: string | null;
  // optional ISO timestamp for a reminder
  reminderAt?: string | null;
  createdAt: string;
};

function keyFor(id: number | string) {
  return `admission_timeline_${id}`;
}

export function useAdmissionTimeline(admissionId: number | string) {
  const [timeline, setTimeline] = useState<AdmissionTimelineItem[]>([]);

  // load
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      // Try remote first
      try {
        const remote = await timelineService.fetchTimeline(admissionId);
        if (!mounted) return;
        // map remote to local shape (ensure id, createdAt exist)
        const mapped = (remote || []).map((r) => ({
          id: String(r.id),
          date: r.date || undefined,
          time: r.time || undefined,
          channel: r.channel || undefined,
          summary: r.summary || undefined,
          nextAction: r.nextAction || undefined,
          assignedTo: r.assignedTo ?? null,
          reminderAt: r.reminderAt ?? null,
          createdAt: r.createdAt || new Date().toISOString(),
        } as AdmissionTimelineItem));
        setTimeline(mapped);
        try {
          localStorage.setItem(keyFor(admissionId), JSON.stringify(mapped));
        } catch {}
        return;
      } catch (e) {
        // fallback to local
      }

      try {
        const raw = localStorage.getItem(keyFor(admissionId));
        if (raw && mounted) {
          setTimeline(JSON.parse(raw) as AdmissionTimelineItem[]);
        }
      } catch (e) {
        console.error("useAdmissionTimeline: failed to load", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [admissionId]);

  const persist = useCallback((items: AdmissionTimelineItem[]) => {
    try {
      localStorage.setItem(keyFor(admissionId), JSON.stringify(items));
    } catch (e) {
      console.error("useAdmissionTimeline: failed to save", e);
    }
  }, [admissionId]);

  const addEntry = useCallback((entry: Omit<AdmissionTimelineItem, "id" | "createdAt">) => {
    const item: AdmissionTimelineItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...entry,
    };
    setTimeline((t) => {
      const next = [item, ...t];
      persist(next);
      return next;
    });

    // Try to create remotely, but don't block UI. If it succeeds, replace local id with remote id.
    (async () => {
      try {
        const remote = await timelineService.createTimelineEntry(admissionId, {
          date: entry.date ?? null,
          time: entry.time ?? null,
          channel: entry.channel ?? null,
          summary: entry.summary ?? null,
          nextAction: entry.nextAction ?? null,
          assignedTo: entry.assignedTo ?? null,
          reminderAt: entry.reminderAt ?? null,
        });
        // replace the optimistic item id with remote id
        setTimeline((t0) => {
          const replaced = t0.map((it) => (it.createdAt === item.createdAt ? { ...it, id: String(remote.id) } : it));
          persist(replaced);
          return replaced;
        });
      } catch (e) {
        // ignore remote failure; user still has local copy
      }
    })();

    return item;
  }, [persist, admissionId]);

  const updateEntry = useCallback((id: string, patch: Partial<AdmissionTimelineItem>) => {
    setTimeline((t) => {
      const next = t.map((it) => (it.id === id ? { ...it, ...patch } : it));
      persist(next);
      return next;
    });

    // try remote update
    (async () => {
      try {
        await timelineService.updateTimelineEntry(admissionId, id, {
          date: patch.date ?? null,
          time: patch.time ?? null,
          channel: patch.channel ?? null,
          summary: patch.summary ?? null,
          nextAction: patch.nextAction ?? null,
          assignedTo: patch.assignedTo ?? null,
          reminderAt: patch.reminderAt ?? null,
        });
      } catch (e) {
        // ignore
      }
    })();
  }, [persist, admissionId]);

  const removeEntry = useCallback((id: string) => {
    setTimeline((t) => {
      const next = t.filter((x) => x.id !== id);
      persist(next);
      return next;
    });

    (async () => {
      try {
        await timelineService.deleteTimelineEntry(admissionId, id);
      } catch (e) {
        // ignore
      }
    })();
  }, [persist, admissionId]);

  const clear = useCallback(() => {
    setTimeline([]);
    try {
      localStorage.removeItem(keyFor(admissionId));
    } catch (e) {}
  }, [admissionId]);

  return { timeline, addEntry, updateEntry, removeEntry, clear };
}
