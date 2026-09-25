// Every editable content file is read through here. Pages CMS leaves blank fields
// out of the file when it saves, so each value gets a safe default.
import rawSettings from '../content/settings.json';
import rawLinks from '../content/links.json';
import rawMerch from '../content/merch.json';
import rawContact from '../content/contact.json';
import { frontmatter as rawAbout } from '../content/about.md';

type Loose<T> = Partial<Record<keyof T, unknown>> & Record<string, unknown>;

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const bool = (value: unknown, fallback: boolean): boolean => (typeof value === 'boolean' ? value : fallback);
const list = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.filter((v) => v && typeof v === 'object') : [];
const obj = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const s = rawSettings as Loose<{ social: unknown }>;
const social = obj(s.social);
export const settings = {
  bandName: str(s.bandName) || 'Bellafaire Brothers',
  tagline: str(s.tagline),
  description: str(s.description),
  heroImage: str(s.heroImage),
  social: {
    instagram: str(social.instagram),
    spotify: str(social.spotify),
    youtube: str(social.youtube),
    appleMusic: str(social.appleMusic),
    bandsintown: str(social.bandsintown),
    tiktok: str(social.tiktok),
    facebook: str(social.facebook),
  },
};

const l = rawLinks as Loose<object>;
export const linksPage = {
  tagline: str(l.tagline),
  profileImage: str(l.profileImage),
  showLatestRelease: bool(l.showLatestRelease, true),
  showLatestVideo: bool(l.showLatestVideo, true),
  showNextShow: bool(l.showNextShow, true),
  links: list(l.links).map((link) => ({
    label: str(link.label),
    url: str(link.url),
    enabled: bool(link.enabled, true),
    highlight: bool(link.highlight, false),
    expires: str(link.expires),
  })),
};

// Links that are switched on and have not passed their expiry date.
export function getActiveLinks() {
  const today = new Date().toISOString().slice(0, 10);
  return linksPage.links.filter((link) => link.enabled && link.label && link.url && (!link.expires || link.expires >= today));
}

const m = rawMerch as Loose<object>;
export const merch = {
  intro: str(m.intro),
  items: list(m.items)
    .map((item) => ({
      name: str(item.name),
      price: str(String(item.price ?? '')),
      sizes: str(item.sizes),
      description: str(item.description),
      image: str(item.image),
      soldOut: bool(item.soldOut, false),
    }))
    .filter((item) => item.name),
};

const c = rawContact as Loose<object>;
export const contact = {
  intro: str(c.intro),
  bookingEmail: str(c.bookingEmail),
  contacts: list(c.contacts)
    .map((entry) => ({ label: str(entry.label), email: str(entry.email) }))
    .filter((entry) => entry.email),
};

const a = obj(rawAbout);
export const about = {
  photo: str(a.photo),
  members: list(a.members)
    .map((member) => ({ name: str(member.name), role: str(member.role), photo: str(member.photo) }))
    .filter((member) => member.name),
};
