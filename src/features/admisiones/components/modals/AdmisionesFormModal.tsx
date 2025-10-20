'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { GENDERS } from '@/features/admisiones/mock/catalogs';
import { CrearAdmision } from '../../types/CrearAdmision';
import { PeriodoAcademicoItem } from '@/features/periodoacademico/Types/PeriodoAcademicoItems';
import { CampusItem } from '@/features/campus/types/CampusItem';
import { NivelEducativoItem } from '@/features/niveleducativo/types/NivelEducativoItems';
import { EstatusAspiranteItem } from '@/features/estatusaspirante/types/EstatusAspiranteItem';
import { MedioContactoItem } from '@/features/mediocontacto/types/mediocontactoItem';
import { HorariosItem } from '@/features/horarios/types/horariosItem';
import { PlanEstudiosItem } from '@/features/planestudios/types/PlanEstudiosItem';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AsentamientoItem, EstadoItem, MunicipioItem } from '@/features/location/types';
import { apiFetch } from '@/lib/fetcher';
import { useAdmisiones } from '../../hooks';
import { EstadoCivil } from '../../types/Admisiones';

/* Combobox (shadcn) */
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';

/** Si no tienes util cn, definimos uno simple local */
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

const FormSchema = z.object({
  // Datos personales requeridos por CrearAdmision
  nombre: z.string().min(1, 'Requerido').regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Nombre inválido'),
  apellidoPaterno: z.string().min(1, 'Requerido').regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Apellido inválido'),
  apellidoMaterno: z.string().min(1, 'Requerido').regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Apellido inválido'),
  fechaNacimiento: z.string().min(1, 'Requerido'), // ISO string
  generoId: z.coerce.number().int().min(1, 'Selecciona género'),
  curp: z.string()
    .min(18, 'CURP debe tener 18 caracteres')
    .regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/, 'CURP inválido'),

  // Contacto
  correo: z.string().email('Correo inválido'),
  telefono: z.string()
    .min(10, 'Teléfono debe tener al menos 10 dígitos')
    .regex(/^\d{10,15}$/, 'Teléfono inválido, solo dígitos'),

  // Dirección
  calle: z.string().min(1, 'Requerido'),
  numeroExterior: z.string().min(1, 'Requerido'),
  numeroInterior: z.string().optional().default(''),
  codigoPostalId: z.coerce.number().int().min(1, 'Selecciona CP'),

  // Estado civil
  idEstadoCivil: z.coerce.number().int().min(1, 'Selecciona estado civil'),

  // Académico y campus
  campusId: z.coerce.number().int().min(1, 'Selecciona campus'),
  planEstudiosId: z.coerce.number().int().min(1, 'Selecciona plan de estudios'),
  aspiranteStatusId: z.coerce.number().int().min(1, 'Selecciona estatus'),
  medioContactoId: z.coerce.number().int().min(1, 'Selecciona medio de contacto'),
  horarioId: z.coerce.number().int().min(1, 'Selecciona horario'),

  // Otros
  notas: z.string().optional().default(''),
  atendidoPorUsuarioId: z.string().optional().default(''),

  // Campos locales para dependencias de ubicación
  municipioId: z.coerce.number().int().optional().default(0),
  estadoId: z.coerce.number().int().optional().default(0),
});

type FormValues = z.infer<typeof FormSchema>;

export interface AdmissionFormModalProps {
  isOpen: boolean;
  EstadosItem: EstadoItem[];
  EstadosCivilItems: EstadoCivil[];
  PlanEstudiosItem: PlanEstudiosItem[];
  PeriodoAcademicoItem: PeriodoAcademicoItem[];
  CampusItem: CampusItem[];
  NivelEducativoItem: NivelEducativoItem[];
  EstatusAspiranteItem: EstatusAspiranteItem[];
  MedioContactoItem: MedioContactoItem[];
  HorariosItem: HorariosItem[];
  onClose: () => void;
  onSubmit: (data: CrearAdmision) => Promise<void>;
  admission?: Partial<CrearAdmision>;
  isSubmitting?: boolean;
}

const ph = (label: string) => `Selecciona ${label}`;

/* =========================
   Combobox de Asentamientos
   ========================= */
function AsentamientoCombobox({
  value,
  onChange,
  items,
  disabled,
  placeholder = 'un asentamiento',
}: {
  value?: number | null;
  onChange: (v: number | null) => void;
  items: AsentamientoItem[];
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      (items || []).map((a) => ({
        id: a.id,
        label: a.asentamiento,
        search: `${a.id} ${a.asentamiento}`, // lo usa CommandInput para filtrar
      })),
    [items]
  );

  const selected = useMemo(
    () => options.find((o) => o.id === value) ?? null,
    [options, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 rounded-lg text-sm"
          disabled={disabled}
        >
          {selected ? selected.label : `Selecciona ${placeholder}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar por nombre o id..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={`asent-${opt.id}`}
                  value={opt.search}
                  onSelect={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', opt.id === value ? 'opacity-100' : 'opacity-0')} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* =======================================
   Componente principal
   ======================================= */
export function AdmissionFormModal({
  isOpen,
  EstadosItem,
  EstadosCivilItems,
  PlanEstudiosItem,
  PeriodoAcademicoItem: _PeriodoAcademicoItem,
  CampusItem,
  NivelEducativoItem: _NivelEducativoItem,
  EstatusAspiranteItem,
  MedioContactoItem,
  HorariosItem,
  onClose,
  onSubmit,
  admission,
  isSubmitting = false,
}: AdmissionFormModalProps) {
  const MySwal = withReactContent(Swal);
  const isEdit = Boolean(admission);

  const [MunicipiosItems, setMunicipiosItems] = useState<MunicipioItem[]>([]);
  const [_AsentamientosItems, setAsentamientosItems] = useState<AsentamientoItem[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as Resolver<FormValues>,
    defaultValues: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      generoId: 0,
      curp: '',
      correo: '',
      telefono: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      codigoPostalId: 0,
      idEstadoCivil: 0,
      campusId: 0,
      planEstudiosId: 0,
      aspiranteStatusId: 0,
      medioContactoId: 0,
      horarioId: 0,
      notas: '',
      atendidoPorUsuarioId: '',
      municipioId: 0,
      estadoId: 0,
    },
  });

  const estadoSelected = form.watch('estadoId');
  const municipioSelected = form.watch('municipioId');

  const { createAdmissionData } = useAdmisiones();

  const fetchMunicipios = useCallback(async (idEstado: string) => {
    try {
      const data: MunicipioItem[] = await apiFetch<MunicipioItem[]>(`/Ubicacion/municipios/${idEstado}`);
      setMunicipiosItems(data);
    } finally {
      // noop
    }
  }, []);

  const fetchAsentamientos = useCallback(async (idMunicipio: string) => {
    try {
      const data: AsentamientoItem[] = await apiFetch<AsentamientoItem[]>(`/Ubicacion/asentamientos/${idMunicipio}`);
      setAsentamientosItems(data);
    } finally {
      // noop
    }
  }, []);

  useEffect(() => {
    if (!estadoSelected || Number(estadoSelected) <= 0) {
      setMunicipiosItems([]);
      form.setValue('municipioId', 0);
      setAsentamientosItems([]);
      form.setValue('codigoPostalId', 0);
      return;
    }
    fetchMunicipios(String(estadoSelected));
  }, [estadoSelected, fetchMunicipios, form]);

  useEffect(() => {
    if (!municipioSelected || Number(municipioSelected) <= 0) {
      setAsentamientosItems([]);
      form.setValue('codigoPostalId', 0);
      return;
    }
    fetchAsentamientos(String(municipioSelected));
  }, [municipioSelected, fetchAsentamientos, form]);

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      nombre: (admission as any)?.nombre ?? '',
      apellidoPaterno: (admission as any)?.apellidoPaterno ?? '',
      apellidoMaterno: (admission as any)?.apellidoMaterno ?? '',
      fechaNacimiento: (admission as any)?.fechaNacimiento ?? '',
      generoId: (admission as any)?.generoId ?? 0,
      curp: (admission as any)?.curp ?? '',
      correo: (admission as any)?.correo ?? '',
      telefono: (admission as any)?.telefono ?? '',
      calle: (admission as any)?.calle ?? '',
      numeroExterior: (admission as any)?.numeroExterior ?? '',
      numeroInterior: (admission as any)?.numeroInterior ?? '',
      codigoPostalId: (admission as any)?.codigoPostalId ?? 0,
      idEstadoCivil: (admission as any)?.idEstadoCivil ?? 0,
      campusId: (admission as any)?.campusId ?? 0,
      planEstudiosId: (admission as any)?.planEstudiosId ?? 0,
      aspiranteStatusId: (admission as any)?.aspiranteStatusId ?? 0,
      medioContactoId: (admission as any)?.medioContactoId ?? 0,
      horarioId: (admission as any)?.horarioId ?? 0,
      notas: (admission as any)?.notas ?? '',
      atendidoPorUsuarioId: (admission as any)?.atendidoPorUsuarioId ?? '',
      municipioId: (admission as any)?.municipioId ?? 0,
      estadoId: (admission as any)?.estadoId ?? 0,
    });
    // Las listas dependientes se cargan con los watchers
  }, [admission, form, isOpen]);

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    const payload: CrearAdmision = {
      nombre: data.nombre,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,
      fechaNacimiento: (data.fechaNacimiento || '').slice(0, 10),
      generoId: Number(data.generoId),
      correo: data.correo,
      telefono: data.telefono,
      curp: data.curp,
      calle: data.calle,
      numeroExterior: data.numeroExterior,
      numeroInterior: data.numeroInterior || '',
      codigoPostalId: Number(data.codigoPostalId),
      idEstadoCivil: Number(data.idEstadoCivil),
      campusId: Number(data.campusId),
      planEstudiosId: Number(data.planEstudiosId),
      aspiranteStatusId: Number(data.aspiranteStatusId),
      medioContactoId: Number(data.medioContactoId),
      notas: data.notas || '',
      atendidoPorUsuarioId: data.atendidoPorUsuarioId || '',
      horarioId: Number(data.horarioId),
    };

    try {
      await createAdmissionData(payload);
      onClose();
      form.reset();

      MySwal.fire({
        title: isEdit ? 'Aspirante actualizado' : 'Aspirante creado',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false,
        toast: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        focusConfirm: true,
      });
    } catch (e: any) {
      onClose();
      MySwal.fire({
        title: 'Error',
        text: e?.message ?? 'No se pudo guardar la admisión',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: true,
        allowEscapeKey: true,
        focusConfirm: true,
      });
    }
  }; // ← cierra SOLO handleSubmit

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl rounded-3xl shadow-xl bg-white/95 backdrop-blur-lg border border-gray-200 p-0 overflow-visible flex flex-col">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Aspirante' : 'Nuevo Aspirante'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1">
            {isEdit ? 'Actualiza la información' : 'Completa los datos requeridos'}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 min-h-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 h-full">

                {/* Nombre y apellidos */}
                <FormField control={form.control} name="nombre" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Nombre *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre(s)" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="apellidoPaterno" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Apellido Paterno *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Apellido paterno" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="apellidoMaterno" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Apellido Materno *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Apellido materno" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Género */}
                <FormField control={form.control} name="generoId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Género *</FormLabel>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un género')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(GENDERS || []).map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>{g.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Fecha de nacimiento */}
                <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Fecha de Nacimiento *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? field.value.substring(0, 10) : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-10 rounded-lg text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Contacto */}
                <FormField control={form.control} name="correo" render={({ field }) => (
                  <FormItem className="space-y-2 col-span-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Correo *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="correo@ejemplo.com"
                        className="h-10 rounded-lg text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="telefono" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Teléfono *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="Ej. 4778902211"
                        className="h-10 rounded-lg text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Información adicional */}
                <FormField control={form.control} name="planEstudiosId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Plan de Estudios *</FormLabel>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un plan de estudios')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(PlanEstudiosItem || []).map((p) => (
                          <SelectItem key={p.idPlanEstudios} value={String(p.idPlanEstudios)}>{p.nombrePlanEstudios}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="atendidoPorUsuarioId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">ID de Usuario</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ID del usuario"
                        className="h-10 rounded-lg text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Dirección */}
                <FormField control={form.control} name="calle" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Calle *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Calle" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="numeroExterior" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Número Exterior *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Número exterior" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="numeroInterior" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Número Interior</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Número interior (opcional)" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Estado */}
                <FormField control={form.control} name="estadoId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Estado *</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un estado')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(EstadosItem || []).map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Municipio */}
                <FormField control={form.control} name="municipioId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Municipio *</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={!form.watch('estadoId')}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un municipio')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(MunicipiosItems || []).map((m: MunicipioItem) => (
                          <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Asentamiento (Combobox buscable) */}
                <FormField control={form.control} name="codigoPostalId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Asentamiento *</FormLabel>
                    <FormControl>
                      <AsentamientoCombobox
                        value={field.value ?? null}
                        onChange={(v) => field.onChange(v ?? undefined)}
                        items={_AsentamientosItems || []}
                        disabled={!form.watch('municipioId')}
                        placeholder="un asentamiento"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Estatus del aspirante */}
                <FormField control={form.control} name="aspiranteStatusId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Estatus del Aspirante *</FormLabel>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('estatus del aspirante')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(EstatusAspiranteItem || []).map((e) => (
                          <SelectItem key={e.idAspiranteEstatus} value={String(e.idAspiranteEstatus)}>{e.descEstatus}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Medio de contacto */}
                <FormField control={form.control} name="medioContactoId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Medio de Contacto *</FormLabel>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un medio de contacto')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(MedioContactoItem || []).map((m) => (
                          <SelectItem key={m.idMedioContacto} value={String(m.idMedioContacto)}>{m.descMedio}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Campus */}
                <FormField control={form.control} name="campusId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Campus *</FormLabel>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un campus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(CampusItem || []).map((c) => (
                          <SelectItem key={c.idCampus} value={String(c.idCampus)}>{c.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Horario */}
                <FormField control={form.control} name="horarioId" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Horario *</FormLabel>
                    <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg text-sm">
                          <SelectValue placeholder={ph('un horario')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="bg-white text-gray-900">
                        {(HorariosItem || []).map((h) => (
                          <SelectItem key={h.idTurno} value={String(h.idTurno)}>{h.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Estado civil */}
                <FormField control={form.control} name="idEstadoCivil" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Estado Civil *</FormLabel>
                    <FormControl>
                      <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-lg text-sm">
                            <SelectValue placeholder={ph('un estado civil')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" className="bg-white text-gray-900">
                          {(EstadosCivilItems || []).map((ec) => (
                            <SelectItem key={ec.idEstadoCivil} value={String(ec.idEstadoCivil)}>{ec.descEstadoCivil}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* CURP */}
                <FormField control={form.control} name="curp" render={({ field }) => (
                  <FormItem className="space-y-2 col-span-2">
                    <FormLabel className="text-sm font-medium text-gray-700">CURP *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="CURP" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                {/* Notas */}
                <FormField control={form.control} name="notas" render={({ field }) => (
                  <FormItem className="space-y-2 col-span-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Notas</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Notas adicionales" className="h-10 rounded-lg text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-10 px-5 rounded-lg border-gray-300 hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-5 rounded-lg text-sm font-medium min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
