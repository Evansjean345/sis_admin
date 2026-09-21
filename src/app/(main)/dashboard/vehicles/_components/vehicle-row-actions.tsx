"use client";

import { useState } from "react";

import Link from "next/link";

import { Eye, Gauge, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteVehicle } from "@/hooks/api/use-vehicles";
import { getErrorMessage } from "@/lib/axios";
import type { Vehicle } from "@/types/vehicle";

import { SpeedLimitDialog } from "./speed-limit-dialog";
import { VehicleFormDialog } from "./vehicle-form-dialog";

export function VehicleRowActions({
  vehicle,
  onDeleted,
  showView = true,
}: {
  vehicle: Vehicle;
  onDeleted?: () => void;
  showView?: boolean;
}) {
  const [dialog, setDialog] = useState<"edit" | "speed" | "delete" | null>(null);
  const remove = useDeleteVehicle();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions pour ${vehicle.registration}`}>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuGroup>
            {showView ? (
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/vehicles/${vehicle.id}`} prefetch={false}>
                  <Eye />
                  Voir le détail
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => setDialog("edit")}>
              <Pencil />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDialog("speed")}>
              <Gauge />
              Limite de vitesse
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDialog("delete")}>
            <Trash2 />
            Archiver le véhicule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <VehicleFormDialog vehicle={vehicle} open={dialog === "edit"} onOpenChange={(o) => !o && setDialog(null)} />
      <SpeedLimitDialog vehicle={vehicle} open={dialog === "speed"} onOpenChange={(o) => !o && setDialog(null)} />
      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(o) => !o && setDialog(null)}
        title={`Archiver ${vehicle.registration} ?`}
        description="Suppression logique : le véhicule n'apparaîtra plus dans la flotte. Démontez son tracker au préalable."
        confirmLabel="Archiver"
        destructive
        loading={remove.isPending}
        onConfirm={() =>
          remove.mutate(vehicle.id, {
            onSuccess: () => {
              toast.success("Véhicule archivé", { description: vehicle.registration });
              setDialog(null);
              onDeleted?.();
            },
            onError: (error) => toast.error("Archivage impossible", { description: getErrorMessage(error) }),
          })
        }
      />
    </>
  );
}
