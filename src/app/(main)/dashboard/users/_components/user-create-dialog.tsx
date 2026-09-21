"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRoles } from "@/hooks/api/use-roles";
import { useCreateUser } from "@/hooks/api/use-users";
import { getErrorMessage } from "@/lib/axios";

import { RoleSelectField, StatusSelectField, TextField } from "./user-form-fields";

const PHONE = /^\+[1-9]\d{7,14}$/;

const schema = z.object({
  fullName: z.string().trim().min(3, { message: "3 caractères minimum." }).max(120),
  email: z.email({ message: "Adresse e-mail invalide." }),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || PHONE.test(v), { message: "Format international attendu : +2250700000000" }),
  password: z.string().min(12, { message: "12 caractères minimum." }).max(128),
  roleId: z.string().min(1, { message: "Choisissez un rôle." }),
  status: z.enum(["pending", "active", "suspended"]),
});

type Values = z.infer<typeof schema>;

const DEFAULTS: Values = { fullName: "", email: "", phone: "", password: "", roleId: "", status: "active" };

export function UserCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const roles = useRoles();
  const create = useCreateUser();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [open, form]);

  function onSubmit(values: Values) {
    create.mutate(
      { ...values, phone: values.phone || undefined },
      {
        onSuccess: (user) => {
          toast.success("Utilisateur créé", { description: user.email });
          onOpenChange(false);
        },
        onError: (error) => toast.error("Création impossible", { description: getErrorMessage(error) }),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !create.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvel utilisateur</DialogTitle>
          <DialogDescription>Le compte est rattaché à votre organisation.</DialogDescription>
        </DialogHeader>
        <form id="user-create-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <TextField control={form.control} name="fullName" label="Nom complet" autoComplete="off" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField control={form.control} name="email" label="E-mail" type="email" autoComplete="off" />
              <TextField control={form.control} name="phone" label="Téléphone" placeholder="+2250700000000" />
            </div>
            <TextField
              control={form.control}
              name="password"
              label="Mot de passe initial"
              type="password"
              autoComplete="new-password"
              description="12 caractères minimum."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <RoleSelectField control={form.control} name="roleId" roles={roles.data ?? []} />
              <StatusSelectField control={form.control} name="status" />
            </div>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button variant="outline" disabled={create.isPending} onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" form="user-create-form" disabled={create.isPending}>
            {create.isPending ? <Spinner data-icon="inline-start" /> : null}
            Créer l'utilisateur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
