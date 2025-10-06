// adapters/catalogs.adapter.ts
import type {
  CatalogOption,
  SelectOption,
  CodigoPostalOption,
} from "@/features/admisiones/types/Catalogs";

export const toSelectOption = (o: CatalogOption): SelectOption => ({
  value: o.id,
  label: o.nombre,
});

export const toSelectOptions = (arr: CatalogOption[] = []): SelectOption[] =>
  arr.map(toSelectOption);

export const cpToSelectOption = (o: CodigoPostalOption): SelectOption => ({
  value: o.id,
  label: `${o.codigo}${o.asentamiento ? " - " + o.asentamiento : ""}`,
});
