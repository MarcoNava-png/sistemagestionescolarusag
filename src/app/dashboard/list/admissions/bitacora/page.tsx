"use client";

import { getAspiranteBitacoraSeguimiento } from "@/features/admisiones/services/admisionesService";
import { useEffect, useState } from "react";

type BitacoraItem = Record<string, any>;

export default function BitacoraSeguimientoPage() {
  const [data, setData] = useState<BitacoraItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await getAspiranteBitacoraSeguimiento();
        console.log(resp);
        
        if (!mounted) return;
        // Si la API regresa { items: [...] } ó un arreglo directo, soporta ambas formas
        const items = Array.isArray(resp) ? resp : Array.isArray(resp?.id) ? resp.id : [];
        setData(items);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "No se pudo cargar la bitácora");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Bitácora de seguimiento</h1>
        <p className="text-sm text-gray-500">Registro de actividades y eventos relacionados con aspirantes.</p>
      </div>

      {loading && <div className="text-sm text-gray-500">Cargando...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Contenido</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-gray-500" colSpan={2}>Sin registros</td>
                </tr>
              )}
              {(data ?? []).map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2 align-top text-gray-700">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(row, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
