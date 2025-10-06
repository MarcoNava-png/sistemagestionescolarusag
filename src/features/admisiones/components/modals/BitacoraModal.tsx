"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BitacoraSeguimiento } from "@/features/admisiones/types/BitacoraSeguimiento";
import { CreateBitacora } from "@/features/admisiones/types/CreateBitacora";
import { createBitacoraSeguimiento, getBitacoraByAspirante } from "@/features/admisiones/services/admisionesService";

const Schema = z.object({
  aspiranteId: z.number().int().min(1),
  usuarioAtiendeId: z.string().min(1, "Requerido"),
  fecha: z.string().min(1, "Requerido"), // YYYY-MM-DD
  medioContacto: z.string().min(1, "Requerido"),
  resumen: z.string().min(1, "Requerido"),
  // usar default para que el tipo sea string (no opcional)
  proximaAccion: z.string().default(""),
});

type FormValues = z.infer<typeof Schema>;

export type BitacoraModalProps = {
  open: boolean;
  onClose: () => void;
  aspiranteId: number | null;
};

export function BitacoraModal({ open, onClose, aspiranteId }: BitacoraModalProps) {
  const [items, setItems] = useState<BitacoraSeguimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema) as Resolver<FormValues>,
    defaultValues: {
      aspiranteId: aspiranteId ?? 0,
      usuarioAtiendeId: "",
      fecha: new Date().toISOString().slice(0, 10),
      medioContacto: "",
      resumen: "",
      proximaAccion: "",
    },
  });

  useEffect(() => {
    form.reset({
      aspiranteId: aspiranteId ?? 0,
      usuarioAtiendeId: "",
      fecha: new Date().toISOString().slice(0, 10),
      medioContacto: "",
      resumen: "",
      proximaAccion: "",
    });
  }, [aspiranteId, form, open]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!open || !aspiranteId || aspiranteId <= 0) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getBitacoraByAspirante(aspiranteId);
        if (!mounted) return;
        setItems(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "No se pudo cargar la bitácora");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [open, aspiranteId]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const payload: CreateBitacora = {
        aspiranteId: values.aspiranteId,
        usuarioAtiendeId: values.usuarioAtiendeId,
        fecha: (values.fecha || "").slice(0, 10),
        medioContacto: values.medioContacto,
        resumen: values.resumen,
        proximaAccion: values.proximaAccion ?? "",
      };
      await createBitacoraSeguimiento(payload);
      // Reload list
      if (aspiranteId) {
        const data = await getBitacoraByAspirante(aspiranteId);
        setItems(data);
      }
      // Reset only text fields, keep aspiranteId and fecha
      form.reset({
        aspiranteId: aspiranteId ?? 0,
        usuarioAtiendeId: "",
        fecha: new Date().toISOString().slice(0, 10),
        medioContacto: "",
        resumen: "",
        proximaAccion: "",
      });
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear la bitácora");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bitácora de seguimiento</DialogTitle>
          <DialogDescription>
            Registra y consulta el seguimiento del aspirante #{aspiranteId ?? ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario de creación */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="aspiranteId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspirante ID</FormLabel>
                    <FormControl>
                      <Input type="number" disabled {...field} value={aspiranteId ?? 0} onChange={() => {}} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="usuarioAtiendeId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario que atiende *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ID del usuario" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fecha" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha *</FormLabel>
                      <FormControl>
                        <Input type="date" value={field.value ? field.value.slice(0,10) : ""} onChange={(e) => field.onChange(e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="medioContacto" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medio de contacto *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej. Teléfono, Email, WhatsApp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="resumen" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumen *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Descripción breve del contacto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="proximaAccion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próxima acción</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Acción a realizar (opcional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>Cerrar</Button>
                  <Button type="submit">Guardar nota</Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Lista */}
          <div>
            <div className="text-sm text-gray-600 mb-2">Registros</div>
            <div className="rounded-md border max-h-[60vh] overflow-auto">
              {loading && <div className="p-3 text-sm text-gray-500">Cargando...</div>}
              {!loading && items.length === 0 && (
                <div className="p-3 text-sm text-gray-500">Sin registros</div>
              )}
              {!loading && items.length > 0 && (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Medio</th>
                      <th className="px-3 py-2">Atendió</th>
                      <th className="px-3 py-2">Resumen</th>
                      <th className="px-3 py-2">Próxima acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={`${it.id}-${idx}`} className="border-t align-top">
                        <td className="px-3 py-2">{(it.fecha ?? "").toString().slice(0,10)}</td>
                        <td className="px-3 py-2">{it.medioContacto}</td>
                        <td className="px-3 py-2">{it.usuarioAtiendeNombre ?? it.usuarioAtiendeId}</td>
                        <td className="px-3 py-2 whitespace-pre-wrap break-words">{it.resumen}</td>
                        <td className="px-3 py-2 whitespace-pre-wrap break-words">{it.proximaAccion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
