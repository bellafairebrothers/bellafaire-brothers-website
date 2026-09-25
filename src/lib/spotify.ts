import settings from '../content/settings.json';
import { env } from './env';

export interface PlatformLink {
  platform: string;
  label: string;
  url: string;
}

export interface Release {
  id: string;
  name: string;
  type: string;
  releaseDate: string;
  image?: string;
  spotifyUrl: string;
  links: PlatformLink[];
}

export const ARTIST_ID = settings.social.spotify.match(/artist\/([A-Za-z0-9]+)/)?.[1] ?? '';

const PLATFORMS: Record<string, string> = {
  appleMusic: 'Apple Music',
  amazonMusic: 'Amazon Music',
  tidal: 'Tidal',
  deezer: 'Deezer',
  youtubeMusic: 'YouTube Music',
};

async function spotifyToken(): Promise<string | undefined> {
  const id = env('SPOTIFY_CLIENT_ID');
  const secret = env('SPOTIFY_CLIENT_SECRET');
  if (!id || !secret) return undefined;
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Spotify token request returned ${res.status}`);
  return (await res.json()).access_token;
}

// Finds Apple Music, Amazon, Tidal, etc. links for a Spotify release using song.link.
async function otherPlatforms(spotifyUrl: string): Promise<PlatformLink[]> {
  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?userCountry=US&url=${encodeURIComponent(spotifyUrl)}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Object.entries(PLATFORMS)
      .filter(([key]) => data.linksByPlatform?.[key]?.url)
      .map(([key, label]) => ({ platform: key, label, url: data.linksByPlatform[key].url }));
  } catch {
    return [];
  }
}

let cache: Promise<Release[]> | undefined;

async function load(): Promise<Release[]> {
  try {
    const token = await spotifyToken();
    if (!token) {
      console.warn('[spotify] No SPOTIFY_CLIENT_ID/SECRET set; using the Spotify artist player instead.');
      return [];
    }
    const res = await fetch(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&market=US&limit=50`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error(`Spotify albums request returned ${res.status}`);
    const data = await res.json();
    const releases: Release[] = [];
    // One at a time: song.link allows ~10 requests per minute without a key.
    for (const album of data.items ?? []) {
      releases.push({
        id: album.id,
        name: album.name,
        type: album.album_type === 'single' && album.total_tracks > 1 ? 'EP' : album.album_type === 'album' ? 'Album' : 'Single',
        releaseDate: album.release_date,
        image: album.images?.[0]?.url,
        spotifyUrl: album.external_urls.spotify,
        links: await otherPlatforms(album.external_urls.spotify),
      });
    }
    return releases.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  } catch (err) {
    console.warn('[spotify] Could not load releases:', err);
    return [];
  }
}

export function getReleases(): Promise<Release[]> {
  return (cache ??= load());
}
