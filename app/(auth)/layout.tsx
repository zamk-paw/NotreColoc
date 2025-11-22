import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      <aside className="relative hidden flex-col overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <Badge className="bg-white/20 text-white">NotreColoc</Badge>
          <span className="text-sm text-white/80">Organiser la maison devient simple</span>
        </div>
        <div className="mt-auto space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">
            Le cockpit moderne pour orchestrer ta colocation.
          </h1>
          <p className="text-lg text-white/80">
            Planifie lessive et tâches, partage les dépenses, invite tes colocataires et garde la maison alignée.
          </p>
        </div>
        <div className="mt-12 flex items-center justify-between text-sm text-white/70">
          <span>Interface moderne, responsive et sécurisée.</span>
          <Link href="https://github.com" className="underline hover:text-white">
            Code source
          </Link>
        </div>
      </aside>
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  );
}
