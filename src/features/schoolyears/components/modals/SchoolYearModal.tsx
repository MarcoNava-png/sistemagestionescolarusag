"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreateSchoolYearPayload, UpdateSchoolYearPayload } from '../../types';

interface Props {
  isOpen: boolean;
  initial?: Partial<UpdateSchoolYearPayload> | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateSchoolYearPayload | UpdateSchoolYearPayload) => Promise<void>;
}

export default function SchoolYearModal({ isOpen, onOpenChange, initial = null, onSave }: Props) {
  const isEdit = Boolean(initial && (initial as any).idSchoolYear);

  const form = useForm<any>({ defaultValues: { clave: '', nombre: '', fechaInicio: '', fechaFin: '' } });

  useEffect(() => {
    if (initial) {
      form.reset({ clave: initial.clave ?? '', nombre: initial.nombre ?? '', fechaInicio: initial.fechaInicio ?? '', fechaFin: initial.fechaFin ?? '' });
    } else {
      form.reset(undefined);
    }
  }, [initial, form, isOpen]);

  const handleSubmit = async (data: any) => {
    if (isEdit && initial && (initial as any).idSchoolYear) {
      await onSave({ ...(data as UpdateSchoolYearPayload), idSchoolYear: (initial as any).idSchoolYear });
    } else {
      await onSave(data as CreateSchoolYearPayload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar ciclo escolar' : 'Nuevo ciclo escolar'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Actualiza el ciclo escolar' : 'Crea un nuevo ciclo escolar'}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="clave" render={({ field }) => (
              <FormItem>
                <FormLabel>Clave</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2024-1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2024 - Semestre 1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-2">
              <FormField control={form.control} name="fechaInicio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha inicio</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="fechaFin" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha fin</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )} />
            </div>

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
