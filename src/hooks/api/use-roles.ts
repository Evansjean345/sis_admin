"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { roleService } from "@/services/role.service";
import type { Role } from "@/types/role";

import { queryKeys } from "./query-keys";

export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles.all,
    queryFn: roleService.list,
    staleTime: 10 * 60_000,
  });
}

/** Dictionnaire roleId → rôle, pratique pour afficher le nom d'un rôle dans une table. */
export function useRolesMap(): Map<string, Role> {
  const { data } = useRoles();
  return useMemo(() => new Map((data ?? []).map((role) => [role.id, role])), [data]);
}
