"use client";

import Link from "next/link";

import { BadgeCheck, KeyRound, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useLogout } from "@/hooks/api/use-auth";
import { useRolesMap } from "@/hooks/api/use-roles";
import { getInitials } from "@/lib/utils";

/** Menu de l'utilisateur connecté (en-tête). */
export function AccountSwitcher() {
  const { data: user, isPending } = useCurrentUser();
  const roles = useRolesMap();
  const logout = useLogout();

  if (isPending) {
    return <Skeleton className="size-8 rounded-lg" />;
  }

  const name = user?.fullName ?? "Utilisateur";
  const roleName = user ? (roles.get(user.roleId)?.name ?? "") : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Menu du compte"
        >
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-lg">
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{name}</span>
              <span className="truncate text-muted-foreground text-xs">{user?.email}</span>
              {roleName ? <span className="truncate text-xs">{roleName}</span> : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" prefetch={false}>
              <BadgeCheck />
              Mon compte
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile?tab=security" prefetch={false}>
              <KeyRound />
              Changer le mot de passe
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={logout.isPending} onClick={() => logout.mutate()}>
          <LogOut />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
