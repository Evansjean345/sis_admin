"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { clearSession, getToken, saveSession } from "@/lib/auth-token";
import { LOGIN_PATH } from "@/lib/axios";
import { authService } from "@/services/auth.service";
import type { ChangePasswordPayload, LoginPayload } from "@/types/auth";

import { queryKeys } from "./query-keys";

/** Utilisateur courant (GET /auth/me). */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authService.me,
    enabled: typeof document !== "undefined" && Boolean(getToken()),
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (session) => {
      queryClient.clear();
      saveSession(session);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout().catch(() => undefined),
    onSettled: () => {
      clearSession();
      // Navigation complète : le cache React Query et les requêtes montées disparaissent avec la page,
      // aucune requête ne repart sans jeton.
      window.location.replace(LOGIN_PATH);
    },
  });
}

/** Le changement de mot de passe révoque les jetons : on stocke le nouveau. */
export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
    onSuccess: (session) => {
      saveSession(session);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
