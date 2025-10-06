"use client";

import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import SubjectModal from './modals/SubjectModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function SubjectsList() {
  const { data, loading, error, create, update, remove } = useSubjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const MySwal = withReactContent(Swal);

  if (loading) return <p>Cargando materias…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={() => { setEditing(null); setModalOpen(true); }}>Nueva materia</button>
      </div>

      <SubjectModal
        isOpen={modalOpen}
        initial={editing}
        onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditing(null); } else setModalOpen(open); }}
        onSave={async (payload) => {
          try {
            if ((payload as any).idSubject) {
              await update(payload as any);
              await MySwal.fire({ icon: 'success', title: 'Materia actualizada', timer: 2000, showConfirmButton: false });
            } else {
              await create(payload as any);
              await MySwal.fire({ icon: 'success', title: 'Materia creada', timer: 2000, showConfirmButton: false });
            }
            setModalOpen(false);
            setEditing(null);
          } catch (e) {
            console.error(e);
            await MySwal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la materia' });
          }
        }}
      />

      <ul className="space-y-2">
        {(data ?? []).map((s: any) => (
          <li key={s.idSubject} className="rounded border p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium">{s.nombre} ({s.clave})</div>
                <div className="text-sm text-gray-500">Créditos: {s.creditos}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(s); setModalOpen(true); }} className="rounded border px-2 py-1 text-sm">Editar</button>
                <button onClick={async () => { if (!confirm('Eliminar materia?')) return; await remove(s.idSubject); }} className="rounded border px-2 py-1 text-sm text-red-600">Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
