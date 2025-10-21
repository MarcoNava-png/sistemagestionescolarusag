"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EstudianteItem, StudentItem } from '../types';
import { GroupItem } from '@/features/groups';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { apiFetch } from '@/lib/fetcher';
import { id } from 'date-fns/locale';


const Schema = z.object({
  matricula: z.string().min(1),
  idPersona: z.number().int().nonnegative(),
  fechaIngreso: z.string().min(1),
  idPlanActual: z.number().int().nonnegative(),
  estado: z.string().min(1),
});

type FormValues = z.infer<typeof Schema>;

function toDateTimeLocalString(input?: string | Date) {
  const d = input instanceof Date ? input : input ? new Date(input) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function InscripcionModal({ open, estudiantes, onClose, initial }: { open: boolean; estudiantes: EstudianteItem[];  onClose: () => void; initial?: Partial<FormValues> }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema), defaultValues: {
      //idEstudiante: initial?.idEstudiante ?? 0,
      matricula: initial?.matricula ?? '',
      //idGrupoMateria: initial?.idGrupoMateria ?? 0,
      idPersona: initial?.idPersona ?? 0,
      fechaIngreso: toDateTimeLocalString(initial?.fechaIngreso),
      idPlanActual: initial?.idPlanActual ?? 0,
      estado: initial?.estado ?? 'Activo',
    }
  });

  const MySwal = React.useMemo(() => withReactContent(Swal), []);

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      matricula: initial?.matricula ?? '',
      idPersona: initial?.idPersona ?? 0,
      fechaIngreso: toDateTimeLocalString(initial?.fechaIngreso),
      idPlanActual: initial?.idPlanActual ?? 0,
      estado: initial?.estado ?? 'Activo',
    });
  }, [open, initial, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await apiFetch<any>('/estudiantes', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      onClose();
      await MySwal.fire({ icon: 'success', title: 'Estudiante creado', text: 'El estudiante se creo correctamente.' });
    } catch (e: any) {
      let message = e?.message || 'Ocurrió un error. Intenta nuevamente.';
      if (e?.body) {
        try {
          const parsed = JSON.parse(e.body);
          message = parsed?.message || message;
        } catch {
          if (typeof e.body === 'string' && e.body.trim()) {
            message = `${message} (${e.body.substring(0, 200)})`;
          }
        }
      }
      onClose();
      await MySwal.fire({ icon: 'error', title: 'No se pudo inscribir', text: message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-3xl shadow-xl bg-white/95 backdrop-blur-lg border border-gray-200 p-0 overflow-visible flex flex-col">
        <DialogHeader>
          <DialogTitle>Inscribir estudiante</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4 p-4 items-center justify-between">
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[220px]">
                  <FormLabel className="text-sm font-medium text-gray-700">Matricula</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Escribe la matrícula"
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idPersona"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[220px]">
                  <FormLabel className="text-sm font-medium text-gray-700">ID Persona</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      readOnly
                      className="mt-1 bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaIngreso"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[220px]">
                  <FormLabel className="text-sm font-medium text-gray-700">Fecha Ingreso</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value?.slice(0, 10)}
                      readOnly
                      className="mt-1 bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idPlanActual"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[220px]">
                  <FormLabel className="text-sm font-medium text-gray-700">Plan Actual</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      readOnly
                      className="mt-1 bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end gap-2 mt-4">
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" >Guardar</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
