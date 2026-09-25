import settings from '../content/settings.json';

export interface Video {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
}

const PLAYLIST_ID = new URL(settings.social.youtube).searchParams.get('list') ?? '';

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// "Bellafaire Brothers - I Wanna See You (Official Music Video)" -> "I Wanna See You"
export function cleanTitle(title: string): string {
  return title
    .replace(/^\s*bellafaire\s+b(?:ro|o|r)thers\s*[-–—|:]\s*/i, '')
    .replace(/\s*[([]\s*(official\s+)?(music\s+)?video\s*[)\]]\s*$/i, '')
    .trim();
}

let cache: Promise<Video[]> | undefined;

async function load(): Promise<Video[]> {
  if (!PLAYLIST_ID) return [];
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`);
    if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    return entries
      .map((entry) => {
        const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '';
        const title = decode(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? '';
        return { id, title: cleanTitle(title), published, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
      })
      .filter((v) => v.id)
      .sort((a, b) => b.published.localeCompare(a.published));
  } catch (err) {
    console.warn('[youtube] Could not load playlist feed:', err);
    return [];
  }
}

export function getVideos(): Promise<Video[]> {
  return (cache ??= load());
}
