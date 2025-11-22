import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getCsrfToken } from "@/lib/csrf";
import { JoinCodeForm } from "@/components/onboarding/join-code-form";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Créer ta colocation", description: "Nom, ville, fuseau horaire et modules." },
  { title: "Configurer les modules", description: "Active les outils nécessaires dès le départ." },
  { title: "Inviter tes colocataires", description: "Partage un lien ou un code sécurisé." },
];

export default async function IntegrationsPage() {
  const session = await requireSession();
  if (session.active_household_id) {
    redirect("/accueil");
  }

  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Onboarding</p>
        <h1 className="text-3xl font-semibold">Bienvenue {session.user.name ?? session.user.email}</h1>
        <p className="text-muted-foreground">
          Choisis une option pour prendre en main NotreColoc : crée ta propre maison ou rejoins une colocation existante.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Créer une colocation</h2>
          <p className="text-sm text-muted-foreground">
            Configure un espace de travail complet avec modules modulaires, invitations et ressources.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              Paramètre chaque module : dépenses, réservations, listes…
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              Envoie des invitations illimitées avec expiration contrôlée.
            </li>
          </ul>
          <Link
            href="/colocations/creer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500"
          >
            Créer une colocation
          </Link>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Rejoindre avec un code</h2>
          <p className="text-sm text-muted-foreground">Un code d’invitation à 64 caractères te donne accès instantanément.</p>
          <div className="mt-6">
            <JoinCodeForm csrfToken={csrfToken} />
          </div>
        </div>
      </div>
      <section className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-muted-foreground">Checklist</p>
            <h3 className="text-xl font-semibold">Déploiement en 3 étapes</h3>
          </div>
          <Link href="/accueil" className="text-emerald-600 hover:underline">
            Aller à l’accueil
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                "rounded-2xl border border-border/70 p-4",
                index === 0 ? "bg-emerald-50/60 dark:bg-emerald-500/10" : ""
              )}
            >
              <p className="text-sm font-semibold text-muted-foreground">Étape {index + 1}</p>
              <p className="text-lg font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
