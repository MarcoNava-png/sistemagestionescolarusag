"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreateHorarioPayload, UpdateHorarioPayload } from '../../types';

interface Props {
  isOpen: boolean;
  initial?: Partial<UpdateHorarioPayload> | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateHorarioPayload | UpdateHorarioPayload) => Promise<void>;
}

export default function HorarioModal({ isOpen, onOpenChange, initial = null, onSave }: Props) {
  const isEdit = Boolean(initial && (initial as any).idHorario);

  const form = useForm<any>({
    defaultValues: {
      nombre: '',
      horaInicio: '08:00',
      horaFin: '10:00',
      dias: 'Lun,Mar,Mié',
    }
  });

  useEffect(() => {
    if (initial) {
      form.reset({
        nombre: initial.nombre ?? '',
        horaInicio: initial.horaInicio ?? '08:00',
        horaFin: initial.horaFin ?? '10:00',
        dias: initial.dias ?? 'Lun,Mar,Mié',
      });
    } else {
      form.reset(undefined);
    }
  }, [initial, form, isOpen]);

  const handleSubmit = async (data: any) => {
    if (isEdit && initial && (initial as any).idHorario) {
      await onSave({ ...(data as UpdateHorarioPayload), idHorario: (initial as any).idHorario });
    } else {
      await onSave(data as CreateHorarioPayload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar horario' : 'Nuevo horario'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Actualiza el horario' : 'Crea un nuevo horario'}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej. Mañana A" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-2">
              <FormField control={form.control} name="horaInicio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora inicio</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="horaFin" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora fin</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="dias" render={({ field }) => (
              <FormItem>
                <FormLabel>Días</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Lun,Mar,Mié" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="min-w-[120px]">{isEdit ? 'Actualizar' : 'Crear'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
