"use client";

import * as React from "react";
import { useGroups } from "../hooks/useGroups";
import type { GroupItem, CreateGroupPayload, UpdateGroupPayload } from "../types";
import GroupModal from "./modals/GroupModal";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { PERIODS, TURNS } from "../mock/catalogs";
import { getPlanEstudios } from "@/features/planestudios/Services/PlanEstudiosService";
import { useEffect } from "react";
import { PlanEstudiosItem } from "@/features/planestudios/types/PlanEstudiosItem";
import { getPeriodoAcademico } from "@/features/periodoacademico/Services/PeriodoAcademicoService";
import { PeriodoAcademicoItem } from "@/features/periodoacademico/Types/PeriodoAcademicoItems";

export default function GroupsList() {
  const { data, loading, error, create, update, remove } = useGroups();
  const [editing, setEditing] = React.useState<Partial<CreateGroupPayload & UpdateGroupPayload> | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [plans, setPlans] = React.useState<PlanEstudiosItem[]>([]);
  const [periodos, setPeriodos] = React.useState<PeriodoAcademicoItem[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getPlanEstudios();
      setPlans(data.items || []);
    };

    const fetchPeriodosAcademicos = async () => {
      const data = await getPeriodoAcademico();
      setPeriodos(data.items || []);
    };

    fetchPlans();
    fetchPeriodosAcademicos();
  }, []);

  const openNew = () => {
    setEditing({ idPlanEstudios: undefined, idPeriodoAcademico: periodos[0]?.idPeriodoAcademico ?? PERIODS[0].id, numeroCuatrimestre: 1, numeroGrupo: 0, idTurno: TURNS[0].id, capacidadMaxima: 0 });
    setModalOpen(true);
  };

  const openEdit = (g: GroupItem) => {
    const planMatch = plans.find((p) => String(p.nombrePlanEstudios) === String(g.planEstudios) || String(p.idPlanEstudios) === String(g.planEstudios));
    const periodoMatch = periodos.find((p) => String(p.nombre) === String(g.periodoAcademico) || String(p.idPeriodoAcademico) === String(g.periodoAcademico));
    setEditing({
      idGrupo: g.idGrupo,
      idPlanEstudios: planMatch?.idPlanEstudios ?? undefined,
      idPeriodoAcademico: periodoMatch?.idPeriodoAcademico ?? undefined,
      numeroCuatrimestre: 1,
      numeroGrupo: g.numeroGrupo,
      idTurno: TURNS.find((t: any) => t.name === g.turno)?.id ?? TURNS[0].id,
      capacidadMaxima: g.capacidadMaxima,
      status: 1,
    });
    setModalOpen(true);
  };

  if (loading) return <p>Cargando grupos…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={openNew}>Nuevo grupo</button>
      </div>

      <GroupModal
        isOpen={modalOpen}
        plans={plans}
        periodos={periodos}
        onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditing(null); } else setModalOpen(open); }}
        initial={editing}
        onSave={async (payload) => {
          try {
            const MySwal = withReactContent(Swal);
            if ((payload as UpdateGroupPayload).idGrupo) {

              if (payload.idPlanEstudios === undefined || payload.idPeriodoAcademico === undefined) {
                await MySwal.fire({
                  icon: 'warning',
                  title: 'Datos incompletos',
                  text: 'Id de plan de estudios o periodo académico es indefinido',
                });
                return;
              }

              await update(payload as UpdateGroupPayload);
            } else {
              await create(payload as CreateGroupPayload);
              await MySwal.fire({
                icon: 'success',
                title: 'Grupo creado',
                text: 'El grupo se ha creado correctamente',
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />

      <ul className="space-y-2">
        {(data?.items ?? []).map((g: GroupItem) => (
          <li key={g.idGrupo + 1} className="rounded border p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium">{g.planEstudios}</div>
                <div className="text-sm text-gray-500">{g.periodoAcademico}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(g)} className="rounded border px-2 py-1 text-sm">Editar</button>
                <button onClick={async () => { if (!confirm('Eliminar grupo?')) return; await remove(g.idGrupo); }} className="rounded border px-2 py-1 text-sm text-red-600">Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
