"use client";

import React from "react";
import type { AdmissionTimelineItem } from "../hooks/useAdmissionTimeline";

export default function Timeline({
  items,
  onRemove,
  onUpdate,
}: {
  items: AdmissionTimelineItem[];
  onRemove?: (id: string) => void;
  // Called to request an update to an entry (e.g., assign, schedule reminder)
  onUpdate?: (id: string, patch: Partial<AdmissionTimelineItem>) => void;
}) {
  return (
    <div className="rounded-xl border bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">Últimos contactos</p>
        <p className="text-xs text-gray-500">{items.length} registros</p>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-700">Sin registros todavía</div>
      ) : (
        <ol className="space-y-4">
          {items.map((t) => (
            <li key={t.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-blue-600" />
                <div className="h-full w-px bg-gray-200" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.summary ?? 'Contacto'}</p>
                    <p className="text-xs text-gray-500">{t.channel ?? ''}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {t.date ? `${t.date}${t.time ? ' ' + t.time : ''}` : new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
                {t.nextAction && <p className="mt-1 text-xs text-gray-600">Próxima acción: {t.nextAction}</p>}
                {t.assignedTo && (
                  <p className="mt-1 text-xs text-gray-600">Asignado a: {t.assignedTo}</p>
                )}
                {t.reminderAt && (
                  <p className="mt-1 text-xs text-indigo-600">Recordatorio: {new Date(t.reminderAt).toLocaleString()}</p>
                )}
                {onRemove && (
                  <div className="mt-2">
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => onRemove(t.id)}
                    >Eliminar</button>
                  </div>
                )}
                {onUpdate && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => {
                        // toggle a simple 24h reminder if none exists, otherwise clear
                        if (!t.reminderAt) {
                          const next = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                          onUpdate(t.id, { reminderAt: next });
                        } else {
                          onUpdate(t.id, { reminderAt: null });
                        }
                      }}
                    >{t.reminderAt ? 'Cancelar recordatorio' : 'Recordar en 24h'}</button>
                    <button
                      className="text-xs text-gray-700 hover:underline"
                      onClick={() => onUpdate(t.id, { assignedTo: prompt('Asignar a (nombre):') || null })}
                    >Asignar</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
