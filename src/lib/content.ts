import merch from '../content/merch.json';
import links from '../content/links.json';

export function getMerch() {
  return merch;
}

// Links that are switched on and have not passed their expiry date.
export function getActiveLinks() {
  const today = new Date().toISOString().slice(0, 10);
  return links.links.filter((l) => l.enabled && l.url && (!l.expires || l.expires >= today));
}
