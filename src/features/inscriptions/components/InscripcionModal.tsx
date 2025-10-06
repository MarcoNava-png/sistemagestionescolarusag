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
import { StudentItem } from '../types';
import { GroupItem } from '@/features/groups';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { apiFetch } from '@/lib/fetcher';


const Schema = z.object({
  idEstudiante: z.number().int().nonnegative(),
  idGrupoMateria: z.number().int().nonnegative(),
  fechaInscripcion: z.string().min(1),
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

export default function InscripcionModal({ open, students, grupos, onClose, initial }: { open: boolean; students: StudentItem[]; grupos: GroupItem[]; onClose: () => void; initial?: Partial<FormValues> }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema), defaultValues: {
      idEstudiante: initial?.idEstudiante ?? 0,
      idGrupoMateria: initial?.idGrupoMateria ?? 0,
      fechaInscripcion: toDateTimeLocalString(initial?.fechaInscripcion),
      estado: initial?.estado ?? 'Activo',
    }
  });

  const MySwal = React.useMemo(() => withReactContent(Swal), []);

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      idEstudiante: initial?.idEstudiante ?? 0,
      idGrupoMateria: initial?.idGrupoMateria ?? 0,
      fechaInscripcion: toDateTimeLocalString(initial?.fechaInscripcion),
      estado: initial?.estado ?? 'Activo',
    });
  }, [open, initial, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await apiFetch<any>('/inscripciones', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      onClose();
      await MySwal.fire({ icon: 'success', title: 'Inscripción creada', text: 'La inscripción se registró correctamente.' });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Inscribir estudiante</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="idEstudiante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Estudiante</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-lg text-sm">
                        <SelectValue placeholder="Selecciona un estudiante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(students || []).map((s) => (
                        <SelectItem key={s.idEstudiante} value={String(s.idEstudiante)}>
                          {s.nombreCompleto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idGrupoMateria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">ID Grupo Materia</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Selecciona un grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(grupos || []).map((g) => (
                          <SelectItem key={g.idGrupo} value={String(g.idGrupo)}>
                            {g.numeroGrupo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaInscripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Fecha Inscripción</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" value={field.value} onChange={field.onChange} className="mt-1" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Estado</FormLabel>
                  <FormControl>
                    <Input {...field} className="mt-1" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex gap-2 justify-end w-full">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
