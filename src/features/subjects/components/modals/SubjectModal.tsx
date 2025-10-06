"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreateSubjectPayload, UpdateSubjectPayload } from '../../types';

interface Props {
  isOpen: boolean;
  initial?: Partial<UpdateSubjectPayload> | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateSubjectPayload | UpdateSubjectPayload) => Promise<void>;
}

export default function SubjectModal({ isOpen, onOpenChange, initial = null, onSave }: Props) {
  const isEdit = Boolean(initial && (initial as any).idSubject);

  const form = useForm<any>({ defaultValues: { clave: '', nombre: '', creditos: 0 } });

  useEffect(() => {
    if (initial) {
      form.reset({ clave: initial.clave ?? '', nombre: initial.nombre ?? '', creditos: initial.creditos ?? 0 });
    } else {
      form.reset(undefined);
    }
  }, [initial, form, isOpen]);

  const handleSubmit = async (data: any) => {
    if (isEdit && initial && (initial as any).idSubject) {
      await onSave({ ...(data as UpdateSubjectPayload), idSubject: (initial as any).idSubject });
    } else {
      await onSave(data as CreateSubjectPayload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar materia' : 'Nueva materia'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Actualiza la materia' : 'Crea una nueva materia'}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="clave" render={({ field }) => (
              <FormItem>
                <FormLabel>Clave</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="EJ. MAT101" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nombre de la materia" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="creditos" render={({ field }) => (
              <FormItem>
                <FormLabel>Créditos</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
