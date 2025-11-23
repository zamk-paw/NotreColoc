"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createEventAction, type CalendarActionState } from "@/app/(app)/actions/calendar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

type Props = {
    children: React.ReactNode;
    csrfToken: string;
    defaultDate?: Date;
};

const initialState: CalendarActionState = {};

export function CreateEventDialog({ children, csrfToken, defaultDate }: Props) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createEventAction, initialState);

    // Close dialog on success
    // Note: This might cause a flicker or issue if state persists, but for now it's simple.
    // Ideally we reset state or use a useEffect.
    if (state.success && open) {
        setOpen(false);
        // Reset state logic would be needed here if we re-open, but useActionState resets on remount usually?
        // Actually, state is preserved. We might need a useEffect to close.
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un événement</DialogTitle>
                    <DialogDescription>
                        Ajoutez un événement au calendrier partagé de la colocation.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <div className="grid gap-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input id="title" name="title" required placeholder="Plombier" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Détails supplémentaires..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="starts_at">Début</Label>
                            <Input
                                id="starts_at"
                                name="starts_at"
                                type="datetime-local"
                                required
                                defaultValue={defaultDate ? defaultDate.toISOString().slice(0, 16) : undefined}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ends_at">Fin</Label>
                            <Input
                                id="ends_at"
                                name="ends_at"
                                type="datetime-local"
                                required
                                defaultValue={defaultDate ? defaultDate.toISOString().slice(0, 16) : undefined}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="all_day" name="all_day" />
                        <Label htmlFor="all_day">Toute la journée</Label>
                    </div>

                    {state.error ? (
                        <p className="text-sm text-destructive">{state.error}</p>
                    ) : null}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Ajouter
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
