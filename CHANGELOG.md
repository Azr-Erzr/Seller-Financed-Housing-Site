# Batch 2 — Changelog

Drop these files into your repo replacing the originals. Commit all at once.

## Files Changed (6 files)

### `src/pages/business/BusinessListings.jsx` — REBUILT
- All filter sections are now **collapsible** with chevron toggles
- Property Category and Deal Type open by default; others collapsed
- Filter options are **pill-shaped buttons** instead of checkbox lists
- Each section shows a count badge when filters are active
- Added **mobile filter drawer** (slides in from left) with "Show X results" button
- Active filter count badge on mobile filter toggle button
- No more scrollbar cutoff — collapsed sections mean content fits naturally

### `src/pages/ProfileDetail.jsx` — DTI Enhancement
- DTI is now a **full calculation breakdown**, not just a color bar
- Shows: monthly debt + proposed payment = total obligations ÷ income = ratio
- Zone-colored visual bar with green/yellow/red background zones
- Contextual recommendation text based on ratio threshold
- All numbers pulled from actual profile data (seed data has real values)

### `src/pages/ListHome.jsx` — Address Autocomplete
- Street Address field now uses **AddressAutocomplete** component
- Types → suggestions appear from OpenStreetMap Nominatim (free, no API key)
- Selecting a suggestion auto-fills the **City** field
- Falls back to plain text if user types without selecting

### `src/pages/business/BusinessListHome.jsx` — Address Autocomplete
- Same AddressAutocomplete wiring for commercial listing form
- Uses emerald ring color to match Business mode
- Auto-fills City/Municipality on selection

### `src/pages/MapSearch.jsx` — Nuclear Map Fix
- Added **inline `<style>` injection** on map init
- Forces tile images to exactly 256×256px with `!important`
- This runs BEFORE any CSS file loads, eliminating load-order issues
- Triple invalidateSize: immediate + requestAnimationFrame + setTimeout(400)
- Style tag is cleaned up on unmount

### `src/pages/business/BusinessMapSearch.jsx` — Same Nuclear Map Fix
- Identical inline style injection for Business mode map

## What This Fixes
1. ✅ Filter scrollbar cutoff — collapsible sections, all options visible
2. ✅ DTI is real calculation — shows actual math, not just a bar
3. ✅ Address autocomplete — suggests addresses, fills city field
4. ✅ Long filter criteria — collapsible, pill-style, mobile drawer
5. ⚡ Map — most aggressive fix possible (CSS + inline style + triple invalidate)

## Next Batch (Wahi-Inspired Map Redesign)
- Trending/Just Listed carousel overlaid on map
- Price pill markers instead of default pins
- Listing cards in left panel with photo thumbnails
- Hover-to-highlight map↔list interaction
- Map/List/Split toggle similar to Wahi
