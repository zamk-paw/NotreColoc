import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm uppercase text-muted-foreground">Compte</p>
        <h1 className="text-3xl font-semibold">Préférences personnelles</h1>
        <AccountNav />
      </header>
      <div className="space-y-6 lg:grid lg:grid-cols-[3fr,1fr] lg:items-start lg:gap-6">
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">{children}</div>
        <div className="rounded-3xl border border-dashed border-border/70 bg-card/50 p-6 text-sm text-muted-foreground">
          <p>Conseil sécurité</p>
          <p className="mt-2">Active bientôt l’A2F et surveille les appareils connectés.</p>
        </div>
      </div>
    </div>
  );
}
