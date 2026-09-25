# Bellafaire Brothers website

Built with [Astro](https://astro.build), hosted free on GitHub Pages, edited with [Pages CMS](https://pagescms.org).

## Editing the site (no code)

1. Go to <https://app.pagescms.org> and sign in with GitHub.
2. Open this repository.
3. Pick a section: **Links page**, **Merch**, **About**, **Contact**, or **Site settings**.
4. Make changes, upload photos, drag items to reorder, then click **Save**.

The live site updates about 1–2 minutes after you save.

## Adding photos to the Photos page (many at once)

Every photo in `src/assets/photos` shows on the Photos page, newest first.

1. Open <https://github.com/bellafairebrothers/bellafaire-brothers-website/upload/main/src/assets/photos>
2. Drag in photos (or tap **choose your files** and select several). Full-size originals and iPhone HEIC photos are fine, up to 25 MB each.
3. Click **Commit changes**.

To delete a photo: Pages CMS → **Media** → **Photos page** → delete it.

Note: Pages CMS can only upload files under about 4 MB, one at a time. For merch, band and member photos, upload them to `src/assets/uploads` on GitHub (shortcut: <https://bellafairebrothers.com/upload>), then choose them in the Pages CMS photo field.

## What updates automatically

The site rebuilds every 6 hours and picks up anything new:

| Section | Source | What you do |
|---|---|---|
| Music | Spotify (+ Apple Music, Amazon, Tidal, Deezer links via song.link) | Release music as usual |
| Videos | YouTube "Music Videos" playlist | Add new music videos to the playlist |
| Shows | Bandsintown | Add shows on Bandsintown for Artists |
| Instagram | Instagram | Post as usual |

To update right away, go to the repository's **Actions** tab → **Build and deploy site** → **Run workflow**.

## Secrets (Settings → Secrets and variables → Actions)

| Name | Where to get it |
|---|---|
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | developer.spotify.com → Dashboard → Create app |
| `BANDSINTOWN_APP_ID` | Bandsintown for Artists dashboard |
| `INSTAGRAM_ACCESS_TOKEN` | Meta developer app (Instagram API with Instagram Login) |

Variable (not secret): `SITE_URL`, e.g. `https://bellafairebrothers.com`.

Every source is optional. Without a key, that section falls back gracefully (e.g. a Spotify player instead of the release grid).

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` to use the API keys locally.
