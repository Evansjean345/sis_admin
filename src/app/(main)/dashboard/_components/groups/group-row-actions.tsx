"use client";

import { useState } from "react";

import Link from "next/link";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteGroup } from "@/hooks/api/use-groups";
import { getErrorMessage } from "@/lib/axios";
import type { Group } from "@/types/group";

import type { GroupFamily } from "./group-family";
import { GroupFormDialog } from "./group-form-dialog";

export function GroupRowActions({
  family,
  group,
  showView = true,
  onDeleted,
}: {
  family: GroupFamily;
  group: Group;
  showView?: boolean;
  onDeleted?: () => void;
}) {
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
  const remove = useDeleteGroup(family.kind);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Actions pour ${group.name}`}
            className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
            size="icon-sm"
            variant="ghost"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {showView ? (
            <DropdownMenuItem asChild>
              <Link href={`${family.route}/${group.id}`} prefetch={false}>
                <Eye />
                Voir le détail
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={() => setDialog("edit")}>
            <Pencil />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDialog("delete")}>
            <Trash2 />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GroupFormDialog
        family={family}
        group={group}
        open={dialog === "edit"}
        onOpenChange={(open) => !open && setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(open) => !open && setDialog(null)}
        title={`Supprimer ${group.name} ?`}
        description={`Suppression logique : le groupe sort des listes mais reste référencé par les politiques, les géofences et le journal d'audit. Les ${family.memberPlural} ne sont pas supprimés.`}
        confirmLabel="Supprimer"
        destructive
        loading={remove.isPending}
        onConfirm={() =>
          remove.mutate(group.id, {
            onSuccess: () => {
              toast.success("Groupe supprimé", { description: group.name });
              setDialog(null);
              onDeleted?.();
            },
            onError: (error) => toast.error("Suppression impossible", { description: getErrorMessage(error) }),
          })
        }
      />
    </>
  );
}
