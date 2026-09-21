import { Suspense } from "react";

import { ShieldCheck } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../../_components/login-form";

export default function LoginV2() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 px-4 sm:w-[350px] sm:px-0">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Connexion</h1>
          <p className="text-muted-foreground text-sm">Accédez à la console d'administration {APP_CONFIG.name}.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <ShieldCheck className="size-4 text-muted-foreground" />
          FR
        </div>
      </div>
    </>
  );
}
