'use client'

import { useState, useEffect, useCallback } from 'react';

import {
  CreatePlanEstudiosDTO,
  UpdatePlanEstudiosDTO,
} from '../types/PlanEstudiosDTO';
import { PlanEstudiosItem } from '../types/PlanEstudiosItem';
import { createPlanEstudios, deletePlanEstudios, getPlanEstudios, updatePlanEstudios } from '../Services/PlanEstudiosService';

export const usePlanEstudios = () => {
  const [items, setItems] = useState<PlanEstudiosItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanEstudios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPlanEstudios();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes de estudio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanEstudios();
  }, [fetchPlanEstudios]);

  const create = async (payload: CreatePlanEstudiosDTO) => {
    try {
      setLoading(true);
      const nuevo = await createPlanEstudios(payload);
      setItems(prev => [nuevo, ...prev]);
      return nuevo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el plan de estudio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (payload: UpdatePlanEstudiosDTO) => {
    try {
      setLoading(true);
      const actualizado = await updatePlanEstudios(payload);
      setItems(prev =>
        prev.map(item =>
          item.idPlanEstudios === actualizado.idPlanEstudios ? actualizado : item
        )
      );
      return actualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el plan de estudio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setLoading(true);
      await deletePlanEstudios(id);
      setItems(prev => prev.filter(item => item.idPlanEstudios !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el plan de estudio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchPlanEstudios,
    create,
    update,
    remove,
  };
};