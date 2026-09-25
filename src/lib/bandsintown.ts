import settings from '../content/settings.json';
import { env } from './env';

export interface Show {
  id: string;
  datetime: string;
  venue: string;
  city: string;
  region: string;
  country: string;
  ticketUrl?: string;
  eventUrl: string;
  lineup: string[];
  description?: string;
}

async function fetchShows(when: 'upcoming' | 'past'): Promise<Show[]> {
  const appId = env('BANDSINTOWN_APP_ID');
  if (!appId) return [];
  try {
    const artist = encodeURIComponent(settings.bandName);
    const res = await fetch(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${appId}&date=${when}`);
    if (!res.ok) throw new Error(`Bandsintown returned ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((e: any) => ({
      id: String(e.id),
      datetime: e.datetime,
      venue: e.venue?.name ?? '',
      city: e.venue?.city ?? '',
      region: e.venue?.region ?? '',
      country: e.venue?.country ?? '',
      ticketUrl: e.offers?.find((o: any) => o.url)?.url,
      eventUrl: e.url,
      lineup: e.lineup ?? [],
      description: e.description || undefined,
    }));
  } catch (err) {
    console.warn(`[bandsintown] Could not load ${when} shows:`, err);
    return [];
  }
}

let upcoming: Promise<Show[]> | undefined;
let past: Promise<Show[]> | undefined;

export function getUpcomingShows(): Promise<Show[]> {
  return (upcoming ??= fetchShows('upcoming').then((s) => s.sort((a, b) => a.datetime.localeCompare(b.datetime))));
}

export function getPastShows(): Promise<Show[]> {
  return (past ??= fetchShows('past').then((s) => s.sort((a, b) => b.datetime.localeCompare(a.datetime))));
}

export function formatShowDate(datetime: string) {
  const d = new Date(datetime);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
    day: d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }),
    year: d.getUTCFullYear(),
  };
}
