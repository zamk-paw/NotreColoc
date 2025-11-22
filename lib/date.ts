import { format, formatISO, isToday } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(date: Date | string | number, fmt = "PPP") {
  return format(typeof date === "string" ? new Date(date) : date, fmt, { locale: fr });
}

export function formatDay(date: Date | string | number) {
  return format(typeof date === "string" ? new Date(date) : date, "EEEE d MMMM", { locale: fr });
}

export function formatTimeRange(start: Date, end: Date) {
  return `${format(start, "HH:mm", { locale: fr })} – ${format(end, "HH:mm", { locale: fr })}`;
}

export function iso(date: Date | string | number) {
  return formatISO(typeof date === "string" ? new Date(date) : date);
}

export function isSameDay(date: Date | string | number) {
  return isToday(typeof date === "string" ? new Date(date) : date);
}
