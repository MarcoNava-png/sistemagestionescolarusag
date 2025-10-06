"use client";

import * as React from "react";
import type { GroupItem } from "../types";

export default function GroupForm({ initial, onCancel, onSave }: { initial?: Partial<GroupItem>; onCancel: () => void; onSave: (payload: Partial<GroupItem>) => Promise<any> }) {
  const [name, setName] = React.useState(initial?.planEstudios ?? "");
  const [description, setDescription] = React.useState(initial?.planEstudios ?? "");
  const [saving, setSaving] = React.useState(false);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="mb-2 w-full rounded border px-2 py-1" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" className="mb-2 w-full rounded border px-2 py-1" />
      <div className="flex gap-2">
        <button disabled={saving} onClick={async () => { setSaving(true); await onSave({ planEstudios: name, periodoAcademico: description }); setSaving(false); }} className="rounded bg-green-600 px-3 py-1 text-white">{saving ? 'Guardando…' : 'Guardar'}</button>
        <button onClick={onCancel} className="rounded border px-3 py-1">Cancelar</button>
      </div>
    </div>
  );
}
