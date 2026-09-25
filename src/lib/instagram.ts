import { env } from './env';

export interface InstagramPost {
  id: string;
  caption: string;
  image: string;
  permalink: string;
  timestamp: string;
  isVideo: boolean;
}

let cache: Promise<InstagramPost[]> | undefined;

async function load(): Promise<InstagramPost[]> {
  const token = env('INSTAGRAM_ACCESS_TOKEN');
  if (!token) return [];
  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${token}`);
    if (!res.ok) throw new Error(`Instagram returned ${res.status}`);
    const data = await res.json();
    return (data.data ?? [])
      .map((p: any) => ({
        id: p.id,
        caption: p.caption ?? '',
        image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
        permalink: p.permalink,
        timestamp: p.timestamp,
        isVideo: p.media_type === 'VIDEO',
      }))
      .filter((p: InstagramPost) => p.image);
  } catch (err) {
    console.warn('[instagram] Could not load posts:', err);
    return [];
  }
}

export function getInstagramPosts(): Promise<InstagramPost[]> {
  return (cache ??= load());
}
