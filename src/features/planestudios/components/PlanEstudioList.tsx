import { usePlanEstudios } from "../hooks/usePlanEstudios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import PlanEstudioFormModal from './modals/PlanEstudioFormModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useEffect, useState } from 'react';
import { NivelEducativoItem } from "@/features/niveleducativo/types/NivelEducativoItems";
import { CampusItem } from "@/features/campus/types/CampusItem";
import { getNivelEducativo } from "@/features/niveleducativo/Services/NivelEducativoService";
import { getCampus } from "@/features/campus/Services/CampusService";
import { Periodisidad } from "@/features/periodoacademico/Types/Periodisidad";
import { PlanEstudiosItem } from "../types/PlanEstudiosItem";
import { apiFetch } from "@/lib/fetcher";

export default function PlanEstudiosList() {
  const { items, loading, error, remove, create, update } = usePlanEstudios();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [periodos, setPeriodos] = useState<Periodisidad[]>([]);
  const [nivelEducativo, setNivelEducativo] = useState<NivelEducativoItem[]>([]);
  const [campus, setCampus] = useState<CampusItem[]>([]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este plan de estudios?')) {
      await remove(id);
    }
  };

  useEffect(() => {
    // Fetch periodos, nivelEducativo, and campus data here and set state
    const fetchPeriodos = async () => {
      const data = await apiFetch<Periodisidad[]>('/Catalogos/periodicidad');
      setPeriodos(data || []);
    };

    const fetchNivelEducativo = async () => {
      const data = await getNivelEducativo();
      setNivelEducativo(data || []);
    };
    const fetchCampus = async () => {
      const data = await getCampus();
      setCampus(data.items || []);
    };

    fetchPeriodos();
    fetchNivelEducativo();
    fetchCampus();
  }, []);

  if (loading) return <p>Cargando planes de estudio...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lista de Planes de Estudio</h2>
        <button
          className="rounded bg-green-600 px-3 py-2 text-white text-sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Nuevo plan
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clave</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>RVOE</TableHead>
            <TableHead>Duración (meses)</TableHead>
            <TableHead>Versión</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((plan: PlanEstudiosItem) => (
            <TableRow key={plan.idPlanEstudios}>
              <TableCell className="font-medium">{plan.clavePlanEstudios}</TableCell>
              <TableCell className="text-sm text-gray-900">{plan.nombrePlanEstudios}</TableCell>
              <TableCell className="text-sm text-gray-500">{plan.rvoe}</TableCell>
              <TableCell>{plan.duracionMeses}</TableCell>
              <TableCell>{plan.version}</TableCell>
              <TableCell className="text-right">
                <button onClick={() => { setEditing(plan); setModalOpen(true); }} className="mr-2 rounded border px-2 py-1 text-sm">Editar</button>
                <button onClick={() => handleDelete(plan.idPlanEstudios)} className="rounded border px-2 py-1 text-sm text-red-600">Eliminar</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

        <PlanEstudioFormModal
          isOpen={modalOpen}
          periodos={periodos}
          nivelEducativo={nivelEducativo}
          campus={campus}
          initial={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSubmit={async (payload: any) => {
            try {
              if (editing && editing.idPlanEstudios) {
              await update({ ...(payload as any), idPlanEstudios: editing.idPlanEstudios });
              const MySwal = withReactContent(Swal);
              await MySwal.fire({ icon: 'success', title: 'Plan actualizado', text: 'El plan se actualizó correctamente', timer: 3000, timerProgressBar: true, showConfirmButton: false });
            } else {
              await create(payload);
              const MySwal = withReactContent(Swal);
              await MySwal.fire({ icon: 'success', title: 'Plan creado', text: 'El plan se creó correctamente', timer: 3000, timerProgressBar: true, showConfirmButton: false });
            }
            setModalOpen(false);
            setEditing(null);
          } catch (err) {
            console.error(err);
            const MySwal = withReactContent(Swal);
            await MySwal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar el plan' });
          }
        }}
      />
    </div>
  );
}