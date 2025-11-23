"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CalendarEvent = {
    id: string;
    title: string;
    description: string | null;
    starts_at: Date;
    ends_at: Date;
    all_day: boolean;
    creator: {
        name: string | null;
        avatar_url: string | null;
    };
};

type Props = {
    events: CalendarEvent[];
};

export function CalendarView({ events }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    // Get days to display (including padding for start of week)
    // We want Monday as start of week
    const days = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    });

    // Adjust for grid alignment (start on Monday)
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
    const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const padding = Array.from({ length: paddingDays }).fill(null);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize">
                    {format(currentDate, "MMMM yyyy", { locale: fr })}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                    <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}

                {padding.map((_, i) => (
                    <div key={`padding-${i}`} className="bg-background/50 min-h-[120px]" />
                ))}

                {days.map((day) => {
                    const dayEvents = events.filter((event) =>
                        isSameDay(new Date(event.starts_at), day)
                    );

                    return (
                        <div
                            key={day.toISOString()}
                            className={cn(
                                "bg-background p-2 min-h-[120px] hover:bg-muted/50 transition-colors cursor-pointer group relative",
                                !isSameMonth(day, currentDate) && "text-muted-foreground bg-muted/20"
                            )}
                        >
                            <div className={cn(
                                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                                isToday(day) && "bg-primary text-primary-foreground"
                            )}>
                                {format(day, "d")}
                            </div>

                            <div className="space-y-1">
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="text-xs p-1.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100 truncate border-l-2 border-emerald-500"
                                        title={event.title}
                                    >
                                        <div className="font-medium truncate">{event.title}</div>
                                        {!event.all_day && (
                                            <div className="text-[10px] opacity-80 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(event.starts_at), "HH:mm")}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
