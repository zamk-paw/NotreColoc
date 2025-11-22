"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createPollAction, type PollActionState } from "@/app/(app)/actions/polls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: PollActionState = {};

type Props = {
  csrfToken: string;
};

export function CreatePollForm({ csrfToken }: Props) {
  const [state, formAction] = useActionState(createPollAction, initialState);
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptions(["", ""]);
      const form = document.getElementById("create-poll-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.success]);

  const updateOption = (index: number, value: string) => {
    setOptions((current) => current.map((option, i) => (i === index ? value : option)));
  };

  const addOption = () => {
    setOptions((current) => [...current, ""]);
  };

  const removeOption = (index: number) => {
    setOptions((current) => current.filter((_, i) => i !== index));
  };

  return (
    <form
      id="create-poll-form"
      action={formAction}
      className="space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm"
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" placeholder="Qui s’occupe des poubelles ?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Contexte</Label>
        <Textarea id="description" name="description" placeholder="Ajoute des précisions (optionnel)" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Options</Label>
          <Button type="button" size="sm" variant="outline" onClick={addOption}>
            <Plus className="mr-2 h-4 w-4" />
            Option
          </Button>
        </div>
        <div className="space-y-2">
          {options.map((value, index) => (
            <div key={`option-${index}`} className="flex items-center gap-2">
              <Input
                name="options[]"
                placeholder={`Option ${index + 1}`}
                value={value}
                onChange={(event) => updateOption(index, event.target.value)}
                required={index < 2}
              />
              {options.length > 2 ? (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded-full border border-destructive/30 p-2 text-destructive transition hover:bg-destructive/10"
                  aria-label="Supprimer l’option"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {state.error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full">
        Créer le sondage
      </Button>
    </form>
  );
}
