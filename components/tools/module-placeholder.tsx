import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
};

export function ModulePlaceholder({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border/70 bg-card/60 p-10 text-center">
      <Badge variant="secondary" className="mb-4">
        Module NotreColoc
      </Badge>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description ?? "Fonctionnalité en préparation."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="outline" asChild>
          <a href="/accueil">Retour à l’accueil</a>
        </Button>
        <Button asChild>
          <a href="/colocations/configuration">Configurer la colocation</a>
        </Button>
      </div>
    </div>
  );
}
