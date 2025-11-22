import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { getCsrfToken } from "@/lib/csrf";
import { CreatePollForm } from "@/components/polls/create-poll-form";
import { votePollAction } from "@/app/(app)/actions/polls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default async function VotesPage() {
  const session = await requireActiveHousehold();
  const polls = await db.poll.findMany({
    where: { household_id: session.active_household_id! },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
      votes: true,
    },
    orderBy: { created_at: "desc" },
  });
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase text-muted-foreground">Module NotreColoc</p>
        <h1 className="text-3xl font-semibold">Votes & décisions</h1>
        <p className="text-sm text-muted-foreground">Crée des sondages rapides pour organiser la vie commune.</p>
      </header>
      <CreatePollForm csrfToken={csrfToken} />
      <section className="space-y-4">
        {polls.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Aucun sondage pour le moment</CardTitle>
              <CardDescription>Lance ton premier vote et collecte rapidement les avis.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          polls.map((poll) => {
            const totalVotes = poll.votes.length;
            const userVote = poll.votes.find((vote) => vote.user_id === session.user_id);
            const pollStatusLabel = poll.status === "open" ? "Ouvert" : "Fermé";
            return (
              <Card key={poll.id}>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {pollStatusLabel}
                    </Badge>
                    <CardTitle>{poll.question}</CardTitle>
                    {poll.description ? <CardDescription>{poll.description}</CardDescription> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Créé {formatDistanceToNow(poll.created_at, { addSuffix: true, locale: fr })}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {poll.options.map((option) => {
                    const voteCount = option.votes.length;
                    const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
                    const isUserChoice = userVote?.option_id === option.id;
                    return (
                      <div key={option.id} className="space-y-2 rounded-2xl border border-border/60 p-3">
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-medium">{option.label}</p>
                          <span className="text-muted-foreground">{voteCount} vote{voteCount > 1 ? "s" : ""}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <form action={votePollAction} className="flex items-center justify-between pt-2">
                          <input type="hidden" name="poll_id" value={poll.id} />
                          <input type="hidden" name="option_id" value={option.id} />
                          <input type="hidden" name="csrfToken" value={csrfToken} />
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                          <Button
                            type="submit"
                            size="sm"
                            variant={isUserChoice ? "default" : "outline"}
                            disabled={poll.status !== "open" || isUserChoice}
                          >
                            {isUserChoice ? "Ton vote" : "Choisir"}
                          </Button>
                        </form>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}
