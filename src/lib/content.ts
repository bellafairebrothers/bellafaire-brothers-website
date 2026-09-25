import merch from '../content/merch.json';
import links from '../content/links.json';

export interface Album {
  slug: string;
  title: string;
  date: string;
  cover: string;
  photos: { image: string; caption?: string }[];
}

const albumFiles = import.meta.glob<{ default: Omit<Album, 'slug'> }>('../content/albums/*.json', { eager: true });

export function getAlbums(): Album[] {
  return Object.entries(albumFiles)
    .map(([path, mod]) => ({ ...mod.default, slug: path.split('/').pop()!.replace(/\.json$/, '') }))
    .filter((a) => a.photos?.length)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export function getMerch() {
  return merch;
}

// Links that are switched on and have not passed their expiry date.
export function getActiveLinks() {
  const today = new Date().toISOString().slice(0, 10);
  return links.links.filter((l) => l.enabled && l.url && (!l.expires || l.expires >= today));
}
