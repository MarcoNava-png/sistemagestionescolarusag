"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { CreateGroupPayload, UpdateGroupPayload } from "../../types";
import { PERIODS, TURNS } from "../../mock/catalogs";
import { PlanEstudiosItem } from "@/features/planestudios/types/PlanEstudiosItem";
import { PeriodoAcademicoItem } from "@/features/periodoacademico/Types/PeriodoAcademicoItems";

type Props = {
  isOpen: boolean;
  plans: PlanEstudiosItem[];
  periodos: PeriodoAcademicoItem[];
  onOpenChange: (open: boolean) => void;
  initial?: Partial<CreateGroupPayload & UpdateGroupPayload> | null;
  onSave: (payload: CreateGroupPayload | UpdateGroupPayload) => Promise<any>;
};

export default function GroupModal({ isOpen, plans, periodos, onOpenChange, initial = null, onSave }: Props) {
  const [state, setState] = React.useState<Partial<CreateGroupPayload & UpdateGroupPayload> | null>(initial);

  React.useEffect(() => setState(initial), [initial]);

  const savingRef = React.useRef(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{state?.idGrupo ? "Editar grupo" : "Nuevo grupo"}</DialogTitle>
          <DialogDescription>Rellena los datos para crear o actualizar el grupo.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label>
            <div className="text-xs text-gray-600">Plan</div>
            <select value={state?.idPlanEstudios} onChange={(e) => setState((s: Partial<CreateGroupPayload & UpdateGroupPayload> | null) => ({ ...(s || {}), idPlanEstudios: Number(e.target.value) }))} className="w-full rounded border px-2 py-1">
              {plans.map((p: PlanEstudiosItem) => <option key={p.idPlanEstudios} value={p.idPlanEstudios}>{p.nombrePlanEstudios}</option>)}
            </select>
          </label>

          <label>
            <div className="text-xs text-gray-600">Periodo</div>
            <select value={state?.idPeriodoAcademico} onChange={(e) => setState((s: Partial<CreateGroupPayload & UpdateGroupPayload> | null) => ({ ...(s || {}), idPeriodoAcademico: Number(e.target.value) }))} className="w-full rounded border px-2 py-1">
              {periodos.map((p: PeriodoAcademicoItem) => <option key={p.idPeriodoAcademico} value={p.idPeriodoAcademico}>{p.nombre}</option>)}
            </select>
          </label>

          <label>
            <div className="text-xs text-gray-600">Cuatrimestre</div>
            <input type="number" value={state?.numeroCuatrimestre ?? 1} onChange={(e) => setState((s: Partial<CreateGroupPayload & UpdateGroupPayload> | null) => ({ ...(s || {}), numeroCuatrimestre: Number(e.target.value) }))} className="w-full rounded border px-2 py-1" />
          </label>

          <label>
            <div className="text-xs text-gray-600">Número de grupo</div>
            <input type="number" value={state?.numeroGrupo ?? 0} onChange={(e) => setState((s: Partial<CreateGroupPayload & UpdateGroupPayload> | null) => ({ ...(s || {}), numeroGrupo: Number(e.target.value) }))} className="w-full rounded border px-2 py-1" />
          </label>

          <label>
            <div className="text-xs text-gray-600">Turno</div>
            <select value={state?.idTurno ?? TURNS[0].id} onChange={(e) => setState((s: Partial<CreateGroupPayload & UpdateGroupPayload> | null) => ({ ...(s || {}), idTurno: Number(e.target.value) }))} className="w-full rounded border px-2 py-1">
              {TURNS.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>

          <label>
            <div className="text-xs text-gray-600">Capacidad máxima</div>
            <input type="number" value={state?.capacidadMaxima ?? 0} onChange={(e) => setState((s: Partial<CreateGroupPayload & UpdateGroupPayload> | null) => ({ ...(s || {}), capacidadMaxima: Number(e.target.value) }))} className="w-full rounded border px-2 py-1" />
          </label>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 ml-auto">
            <button className="rounded border px-3 py-1" onClick={() => onOpenChange(false)}>Cancelar</button>
            <button
              className="rounded bg-green-600 px-3 py-1 text-white"
              onClick={async () => {
                if (!state) return;
                savingRef.current = true;
                try {
                  if (state.idGrupo) {
                    await onSave(state as UpdateGroupPayload);
                  } else {
                    await onSave(state as CreateGroupPayload);
                  }
                } finally {
                  savingRef.current = false;
                  onOpenChange(false);
                }
              }}
            >Guardar</button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
