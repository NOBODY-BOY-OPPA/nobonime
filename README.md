# Nobonime

A production-minded MERN starter for bilingual anime and manga discovery.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set a strong `JWT_SECRET`.
2. Set `VIDEO_PROVIDERS_JSON` to a JSON array of licensed direct providers. Each URL must contain `{id}` and resolve to `.m3u8` or `.mp4`; use `type: "html"` only for an authorized page containing a playable source.
3. Set `CATALOG_API_URL` and its optional `CATALOG_API_KEY` to the catalog service you use.
4. Set `COMICK_CHAPTER_URL` with `{mangaId}` and `{chapterId}` placeholders to your ComicK-compatible endpoint.
5. Copy `frontend/.env.example` to `frontend/.env` if the API is not on port 4000.
3. Run `npm run install:all` from this directory.
4. Start the API with `npm start` in `backend`, and Vite with `npm run dev` in `frontend`.

The API includes health checks, rate limiting, JWT auth, provider cooling/fallback, configurable catalog and chapter integrations, and a WhatsApp Cloud API preview mode when credentials are not configured.
