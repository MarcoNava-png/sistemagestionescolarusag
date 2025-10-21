import React from 'react';
import { EstudianteItem, Inscripcion, StudentItem } from '@/features/inscriptions/types';
import AvatarFoto from './AvatarFoto';

export default function InscripcionesTable({
  items,
  isSelected,
  toggleOne,
  toggleAllVisible,
  allSelectedOnPage,
  formatDate,
  nombreCompleto,
  badgeClassesByStatus,
  onInscribir,
}: {
  items: Inscripcion[];
  estudiantes: EstudianteItem[];
  isSelected: (id: string) => boolean;
  toggleOne: (id: string) => void;
  toggleAllVisible: () => void;
  allSelectedOnPage: boolean;
  formatDate: (d?: string | null) => string;
  nombreCompleto: (p: any) => string;
  badgeClassesByStatus: (s?: string | null) => string;
  onInscribir: (id: string) => void;
}) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full table-auto">
        <colgroup>
          <col className="w-[44px]" />
          <col className="w-[360px]" />
          <col />
          <col className="w-[160px]" />
          <col className="w-[120px]" />
          <col className="w-[130px]" />
          <col className="w-[120px]" />
          <col className="w-[128px]" />
        </colgroup>
        <thead className="text-left text-xs font-semibold text-gray-500">
          <tr>
            <th className="px-3 py-2">
              <input type="checkbox" aria-label="Seleccionar todos" className="h-4 w-4 rounded border-gray-300" checked={allSelectedOnPage} onChange={toggleAllVisible} />
            </th>
            <th className="px-3 py-2">Estudiante</th>
            <th className="px-3 py-2">Programa</th>
            <th className="px-3 py-2">Plan</th>
            <th className="px-3 py-2">Período</th>
            <th className="px-3 py-2">Estatus</th>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {items.map((i) => {
            const p = i.estudiante.persona;
            const nombre = nombreCompleto(p);
            const badgeCls = badgeClassesByStatus(i.estatus);
            const checked = isSelected(i.id);
            return (
              <tr key={i.id} className="align-top">
                <td className="px-3 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={checked} onChange={() => toggleOne(i.id)} aria-label={`Seleccionar ${nombre || i.estudiante.id}`} />
                </td>

                <td className="px-3 py-3 min-w-0">
                  <div className="flex items-start gap-3 min-w-0">
                    <AvatarFoto src={undefined} alt={nombre || i.estudiante.id} />
                    <div className="min-w-0">
                      <p className="font-medium leading-5 break-words">{nombre || '—'}</p>
                      <p className="text-xs text-gray-500">ID: {i.estudiante.id}</p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 max-w-0 min-w-0">
                  <p className="font-medium break-words whitespace-normal">{i.programa?.nombre ?? '—'}</p>
                </td>

                <td className="px-3 py-3 max-w-0 min-w-0">
                  <p className="break-words whitespace-normal">{i.plan?.nombre ?? '—'}</p>
                </td>

                <td className="px-3 py-3">{i.periodo ?? '—'}</td>

                <td className="px-3 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeCls}`}>{i.estatus ?? '—'}</span>
                </td>

                <td className="px-3 py-3">{formatDate(i.fechaInscripcion)}</td>

                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Inscribir" onClick={() => onInscribir(i.id)}>Inscribir</button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Ver">🔗</button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50" title="Eliminar">🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="px-3 py-10 text-center text-sm text-gray-500">No hay inscripciones.</div>
      )}
    </div>
  );
}
