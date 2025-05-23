import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, EnrichedVehicle, LocationVehicle, PaginationMeta } from '../types/Vehicle';

const AUTH_TOKEN = process.env.VITE_AUTH_TOKEN || '';

const API_PROXY_PREFIX = "https://develop-back-rota.rota361.com.br";

interface UseVehiclesProps {
  filter: string;
  type: string;
  page: number;
  perPage: number;
  fetchTrigger: number;
}

interface UseVehiclesResult {
  data: EnrichedVehicle[];
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasMore: boolean;
}

export const useVehicles = ({ filter, type, page, perPage, fetchTrigger }: UseVehiclesProps): UseVehiclesResult => {
  const [vehicles, setVehicles] = useState<EnrichedVehicle[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchVehicles = useCallback(async () => {
    setIsError(false);
    setError(null);
    setIsLoading(true);

    try {
      const fullPath = `${API_PROXY_PREFIX}/recruitment/vehicles/list-with-paginate`;
      const url = new URL(fullPath);
      console.log('url', url)
      if (filter) url.searchParams.append('filter', filter);
      if (type) url.searchParams.append('type', type);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('perPage', perPage.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na API (${response.status}):`, errorText); // Manter este log de erro
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`Erro na API (${response.status}): ${errorJson.message || JSON.stringify(errorJson)}`);
        } catch {
          throw new Error(`Erro na API (${response.status}): ${errorText}`);
        }
      }

      const result: ApiResponse = await response.json();

      const newVehiclesData = result.content.vehicles || [];
      const newLocationVehiclesData = result.content.locationVehicles || [];
      const newMeta: PaginationMeta = {
        totalPages: result.content.totalPages,
        page: result.content.page,
        perPage: result.content.perPage,
        totalItems: (result.content.totalPages || 0) * (parseInt(result.content.perPage as string) || 0)
      };

      const locationMap = new Map<string, LocationVehicle>();
      newLocationVehiclesData.forEach(loc => {
        if (loc.plate) {
          locationMap.set(loc.plate, loc);
        }
      });

      const enrichedNewVehicles: EnrichedVehicle[] = newVehiclesData.map(vehicle => {
        const location = locationMap.get(vehicle.plate);

        return {
          ...vehicle,
          latitude: location ? location.lat : undefined,
          longitude: location ? location.lng : undefined,
          equipmentId: location?.equipmentId,
          ignition: location?.ignition,
          speed: location?.speed,
        } as EnrichedVehicle;
      });

      setVehicles(prevVehicles => {
        let updatedVehicles;
        if (fetchTrigger !== 0 || page === 1) {
            updatedVehicles = enrichedNewVehicles;
        } else {
            updatedVehicles = [...prevVehicles, ...enrichedNewVehicles];
        }
        return updatedVehicles;
      });
      
      setMeta(newMeta);
      setHasMore(newMeta.page < newMeta.totalPages);

    } catch (err: any) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(err.message || "Ocorreu um erro desconhecido"));
      console.error("Erro ao buscar veículos:", err); // Manter este log de erro
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [filter, type, page, perPage, fetchTrigger]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { data: vehicles, meta, isLoading, isError, error, hasMore };
};