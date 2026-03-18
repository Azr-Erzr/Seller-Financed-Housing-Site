# LandMatch Update — Changelog

## How to Apply
Drop these files into your existing repo, replacing the originals.
All paths match the existing repo structure. Commit all at once for a single deploy.

---

## Changes by File

### 🗺️ MAP FIX (Root Cause)

**`src/index.css`** — THE actual fix
- Added `.leaflet-container img { max-width: none !important }` override
- Root cause: Tailwind Preflight sets `img { max-width: 100%; display: block }` globally
- This constrained Leaflet tile images from their expected 256×256px, producing the staircase offset pattern you see in the screenshot
- Also overrides `.leaflet-container a` to prevent Tailwind's blue link styles bleeding into map controls
- This is a CSS-layer fix — previous attempts targeted JS initialization timing, which was already correct

**`src/pages/MapSearch.jsx`** — Belt-and-suspenders hardening
- Added `ResizeObserver` on the map container so `invalidateSize()` fires automatically on any layout change
- Added secondary `setTimeout(300)` invalidateSize as fallback
- Cleanup properly disconnects observer

**`src/pages/business/BusinessMapSearch.jsx`** — Same fix applied (Rule 1: dual mode)

### 🔒 SECURITY FIXES

**`src/lib/storage.js`**
- `getAllProfiles()` and `getProfileById()` now query `public_profiles` VIEW instead of `profiles` table
- This enforces `show_income` privacy masking at the database level (previously bypassed)
- Added `owner_email` field to `listingToRow()` and `profileToRow()` — enables future auth-gated editing

**`src/lib/commercial-storage.js`**
- Same view fix: queries `public_commercial_profiles` instead of `commercial_profiles`
- Added `owner_email` field to both `listingToRow()` and `profileToRow()`

### 📊 NEW FEATURES

**`src/pages/ListingDetail.jsx`**
- Added "What You're Saving on This Property" callout
- Shows per-listing commission savings: listing agent (2.5%), buyer's agent (2.5%), HST, total
- Shows interest income estimate when VTB financing is available
- Includes proper disclaimer
- Added `DetailSkeleton` loading state (replaces plain "Loading..." text)

**`src/pages/business/BusinessListingDetail.jsx`**
- Added equivalent "Vendor Savings on This Property" callout
- Uses 2–3% commercial commission range instead of 5% residential
- Mentions CRA capital gains deferral
- Added `DetailSkeleton` loading state

**`src/components/LoadingSkeleton.jsx`** — NEW FILE
- Reusable skeleton components: `ListingsSkeleton`, `DetailSkeleton`, `MapSkeleton`
- Animated pulse effect matching existing card dimensions

### 🎨 UI / UX IMPROVEMENTS

**`src/pages/Home.jsx`**
- Aligned savings figure from "$33,900 on $600K" to "over $36,000 on a $650K home" (matches the deal table on the same page)
- Added trust signals section: "Backed by Ontario Law", "Lawyer Required", "No Referral Kickbacks", "Income Privacy"
- Added loading skeleton for featured listings while data loads
- Changed data loading to `Promise.all` with `finally` for proper loading state

**`src/components/Navbar.jsx`**
- Added Homes/Business mode switcher to mobile hamburger menu
- Previously, mobile users could only switch mode via footer pill (required scrolling)

**`src/pages/Partners.jsx`**
- Added explicit no-referral-fee disclaimer to the "Become a Partner" CTA section
- "LandMatch does not charge referral fees or take commissions from professionals listed in this directory"

### ⚙️ BUILD & CONFIG

**`tailwind.config.cjs`**
- Fixed `export default` (ESM syntax) to `module.exports` (CJS syntax)
- File extension is `.cjs` which requires CommonJS — was technically invalid before

### ☁️ CLOUDFLARE PAGES MIGRATION

**`public/_redirects`** — NEW FILE
- SPA routing rule: `/* /index.html 200`
- Ensures React Router handles all routes on Cloudflare Pages

**`public/_headers`** — NEW FILE
- Cache headers for static assets (1 year immutable for /assets/*)
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

**`CLOUDFLARE-MIGRATION.md`** — NEW FILE
- Step-by-step migration guide from Vercel to Cloudflare Pages
- Comparison table (free tier limits)
- Supabase settings that need updating after migration

---

## Remaining Items (Not in This Batch)

These were identified in the audit but require either more context or are separate work items:

1. **Seed data flag** — `storage.js` always merges seed data with Supabase data. Need a `USE_SEED=false` flag for production.
2. **Image upload pipeline** — `saveListing()` doesn't upload images to Supabase Storage bucket. Real users can't persist photos.
3. **Input validation** — Listing/profile forms accept any value for financial fields.
4. **SaveSearch on BusinessListings** — Still not wired in (pending item #1 from handoff).
5. **AddressAutocomplete wiring** — Component exists but isn't connected to forms.
6. **Auth-gated editing** — `owner_email` is now being set, but UI and RLS policy still needed.
7. **About page restructure** — Should lead with the problem (broken system), not the solution.
