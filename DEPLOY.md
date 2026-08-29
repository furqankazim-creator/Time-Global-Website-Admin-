# Deploying Time Global (site + API)

Two deployables, one repo:

| Piece | Path | Runtime |
|---|---|---|
| Public site + admin SPA | `/` (Vite → `dist/`) | any static host |
| API + CMS | `/server` (Express) | Node 20+, MongoDB |

## 1. The critical proxy rules (SEO breaks without these)

`sitemap.xml`, `robots.txt` and uploaded media are served by the **API**, but
crawlers and browsers request them from the **site's** origin. The static host
must forward these paths to the API origin:

```
/sitemap.xml   →  https://<api-host>/sitemap.xml
/robots.txt    →  https://<api-host>/robots.txt
/api/*         →  https://<api-host>/api/*
/uploads/*     →  https://<api-host>/uploads/*     (local storage driver only)
```

Examples — Netlify `_redirects`:

```
/sitemap.xml   https://api.timeglobaltech.com/sitemap.xml   200
/robots.txt    https://api.timeglobaltech.com/robots.txt    200
/api/*         https://api.timeglobaltech.com/api/:splat    200
/uploads/*     https://api.timeglobaltech.com/uploads/:splat 200
/*             /index.html                                   200
```

Vercel `vercel.json` uses `rewrites` with the same four rules, then the SPA
fallback. Nginx: four `location` blocks with `proxy_pass`, then
`try_files $uri /index.html`.

The final SPA fallback (`/* → /index.html`) is also required — deep links like
`/blog/some-post` 404 without it.

## 2. Environment

### Site (build-time)
```
VITE_API_URL=https://api.timeglobaltech.com   # baked in at `vite build`
```

### API (`server/.env` — see `server/.env.example`)
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://…          # Atlas; enable automated backups
JWT_ACCESS_SECRET=  (openssl rand -base64 48)
JWT_REFRESH_SECRET= (different value, same command)
CORS_ORIGINS=https://timeglobaltech.com
SITE_URL=https://timeglobaltech.com   # used in sitemap/robots URLs
PUBLIC_API_URL=https://api.timeglobaltech.com
STORAGE_DRIVER=local                  # or cloudinary once implemented
```

SMTP is configured **in the admin panel** (Settings → Email/SMTP), not env.

## 3. First boot

```bash
cd server && npm ci && npm run build
npm run seed              # prints the admin password ONCE — save it
node dist/index.js        # or a process manager (pm2/systemd/Railway)
npm run seed:content      # optional demo content
```

Then build the site: `npm ci && npm run build` → deploy `dist/`.

## 4. Checklist before flipping DNS

- [ ] `https://site/sitemap.xml` returns XML (proxy works)
- [ ] `https://site/robots.txt` lists the sitemap
- [ ] `https://site/api/v1/public/services` returns JSON
- [ ] Admin login at `/admin`; change the seeded password
- [ ] Contact form submission appears in Admin → Leads
- [ ] `CORS_ORIGINS` contains exactly the production origin (no localhost)
- [ ] Mongo Atlas backups enabled (there is deliberately no backup UI)

## 5. Notes

- The API sets `trust proxy: 1` — correct behind one proxy hop; adjust if you
  chain more (rate limiting keys off client IP).
- `/uploads` only matters while `STORAGE_DRIVER=local`; with Cloudinary the
  media URLs are absolute and the rule can be dropped.
- Auto-deploy: pushing `main` triggers the site workflow — deploy the API
  first when a release touches both, since the site consumes its endpoints.
