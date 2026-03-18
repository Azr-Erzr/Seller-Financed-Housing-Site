# LandMatch — Cloudflare Pages Migration Guide

## Why Cloudflare Pages

| Feature | Vercel Free | Cloudflare Pages Free |
|---------|------------|----------------------|
| Builds/month | ~100 (rate-limited) | 500 |
| Bandwidth | 100 GB | Unlimited |
| Requests | Varies | Unlimited |
| Sites | 3 | Unlimited |
| Preview deploys | Yes | Yes |
| Custom domains | Yes | Yes |
| Edge network | Global | Global (275+ cities) |
| Paid tier | $20/mo | $5/mo (5,000 builds) |

## Migration Steps

### 1. Create Cloudflare Account
Go to https://dash.cloudflare.com and sign up (free).

### 2. Connect Repository
- Dashboard → Workers & Pages → Create → Pages → Connect to Git
- Authorize GitHub and select `Seller-Financed-Housing-Site`
- Branch: `main`

### 3. Build Settings
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave default)
- **Node.js version:** Set environment variable `NODE_VERSION` = `18`

### 4. Environment Variables
Add these in the Cloudflare Pages settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://owbafsbprnbwgakpubwj.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (your anon key from Supabase dashboard) |
| `NODE_VERSION` | `18` |

**Important:** Vite env vars must be prefixed with `VITE_` to be exposed to the client bundle.

### 5. Deploy
Click "Save and Deploy." Cloudflare will build and deploy automatically.
Your site will be available at `https://<project-name>.pages.dev`.

### 6. SPA Routing
The `public/_redirects` file (already added) handles client-side routing:
```
/* /index.html 200
```
This ensures React Router works for all routes on hard refresh.

### 7. Update Supabase Settings
After deployment, update these in Supabase:

**Auth → URL Configuration:**
- Site URL: `https://<your-cloudflare-domain>`
- Redirect URLs: Add `https://<your-cloudflare-domain>/account`

**Edge Function Secrets:**
- Update `SITE_URL` to your new Cloudflare Pages URL

**Auth → Email Templates:**
- Update any hardcoded URLs in the magic link template

### 8. Custom Domain (Optional)
- Cloudflare Pages → Custom domains → Add
- If your domain is already on Cloudflare DNS, it configures automatically
- If not, add the CNAME record: `<your-domain>` → `<project>.pages.dev`

### 9. Remove Vercel
Once Cloudflare is confirmed working:
1. Remove the Vercel integration from your GitHub repo
2. Delete the project from Vercel dashboard
3. Update any bookmarked URLs

## Differences from Vercel

- **No `vercel.json` needed** — Cloudflare uses `_redirects` and `_headers` in `public/`
- **No serverless functions** — Supabase Edge Functions handle server-side logic anyway
- **Preview deploys** work the same — every PR gets a preview URL
- **Build logs** are in the Cloudflare dashboard under Deployments

## Troubleshooting

**Build fails with Node version error:**
Set `NODE_VERSION=18` in environment variables.

**Routes 404 on refresh:**
Ensure `public/_redirects` contains `/* /index.html 200`.

**Environment variables not working:**
Cloudflare requires a rebuild after changing env vars. Trigger a new deploy after updating.
