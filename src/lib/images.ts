import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// Every image in src/assets, keyed by its path (e.g. "/src/assets/uploads/photo.jpg"),
// which is the format Pages CMS writes into the content files.
const localImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export function localImage(path: string | undefined | null): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = path.startsWith('/') ? path : `/${path}`;
  // iPhone HEIC uploads are converted to .jpg during the GitHub build.
  return localImages[key]?.default ?? localImages[key.replace(/\.heic$/i, '.jpg')]?.default;
}

// Downloads and optimizes a remote image at build time. Falls back to the original URL
// if the download fails, so one broken thumbnail never breaks the whole build.
export async function remoteImage(url: string | undefined, width: number): Promise<string | undefined> {
  if (!url) return undefined;
  try {
    const result = await getImage({ src: url, inferSize: true, width, format: 'webp' });
    return result.src;
  } catch {
    return url;
  }
}
