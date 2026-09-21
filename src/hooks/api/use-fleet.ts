"use client";

import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";

import { deviceService } from "@/services/device.service";
import { vehicleService } from "@/services/vehicle.service";
import type { TrackRange } from "@/types/track";
import type { VehicleDetail } from "@/types/vehicle";

import { queryKeys } from "./query-keys";

/** Nombre de véhicules suivis simultanément sur la carte (une requête détail par véhicule). */
export const FLEET_MAX_VEHICLES = 100;

/**
 * Flotte sur la carte : liste des véhicules actifs + détail de chacun
 * (boîtier monté et dernière position), rafraîchi toutes les 30 s.
 */
export function useFleet(enabled = true) {
  const list = useQuery({
    queryKey: queryKeys.vehicles.list({ perPage: FLEET_MAX_VEHICLES, status: "active" }),
    queryFn: () => vehicleService.list({ perPage: FLEET_MAX_VEHICLES, status: "active" }),
    refetchInterval: 5 * 60_000,
    enabled,
  });

  const details = useQueries({
    queries: (list.data?.data ?? []).map((v) => ({
      queryKey: queryKeys.vehicles.detail(v.id),
      queryFn: () => vehicleService.get(v.id),
      refetchInterval: 30_000,
      placeholderData: keepPreviousData,
    })),
    // `combine` est mémoïsé par React Query : référence stable tant que les données ne changent pas.
    combine: (results) => ({
      vehicles: results.map((r) => r.data).filter((d): d is VehicleDetail => Boolean(d)),
      pending: results.length > 0 && results.every((r) => r.isPending),
      fetching: results.some((r) => r.isFetching),
      refetchAll: () => {
        for (const r of results) void r.refetch();
      },
    }),
  });

  return {
    vehicles: details.vehicles,
    total: list.data?.meta.total ?? 0,
    isPending: list.isPending || details.pending,
    isError: list.isError,
    error: list.error,
    isFetching: list.isFetching || details.fetching,
    refetch: () => {
      void list.refetch();
      details.refetchAll();
    },
  };
}

/** Trajet d'un boîtier sur une période (historique flespi). */
export function useTrack(deviceId: string | null | undefined, range: TrackRange, onlyValidFix = false) {
  const live = range.to.getTime() > Date.now() - 60_000;
  return useQuery({
    queryKey: ["track", deviceId ?? "", range.from.toISOString(), range.to.toISOString(), onlyValidFix] as const,
    queryFn: () => deviceService.track(deviceId as string, range, { onlyValidFix }),
    enabled: Boolean(deviceId),
    placeholderData: keepPreviousData,
    staleTime: live ? 30_000 : 10 * 60_000,
    retry: false,
  });
}
