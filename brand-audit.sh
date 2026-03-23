#!/bin/bash
# brand-audit.sh
# Mega-Batch E (Batch 22d) — Brand consistency sweep.
# Run from project root: bash brand-audit.sh
#
# Checks for:
# 1. Old brand names (LandMatch, HomeMatch, hm_*)
# 2. Old domain URLs (workers.dev, vercel.app)
# 3. Inconsistent naming (SelFi, Selfi, sel-fi vs Sel-Fi)
# 4. Legacy localStorage keys (hm_*)
# 5. Maplibre references (should be mapbox post-migration)
# 6. Leaflet references (should be gone)

echo "═══════════════════════════════════════════════════"
echo "  Sel-Fi Brand Consistency Audit"
echo "═══════════════════════════════════════════════════"
echo ""

ERRORS=0

check() {
  local pattern="$1"
  local desc="$2"
  local results
  results=$(grep -rn --include="*.jsx" --include="*.js" --include="*.html" --include="*.css" --include="*.md" "$pattern" src/ index.html public/ 2>/dev/null | grep -v "node_modules" | grep -v "brand-audit.sh")
  if [ -n "$results" ]; then
    echo "❌ FOUND: $desc"
    echo "$results" | head -10
    if [ $(echo "$results" | wc -l) -gt 10 ]; then
      echo "   ... and $(( $(echo "$results" | wc -l) - 10 )) more"
    fi
    echo ""
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ Clean: $desc"
  fi
}

echo "── Old brand names ──────────────────────────────"
check "LandMatch" "LandMatch references"
check "HomeMatch" "HomeMatch references"
check "homematch" "homematch references (case-insensitive in filenames)"
echo ""

echo "── Old domain URLs ──────────────────────────────"
check "vercel\.app" "Vercel deployment URLs"
check "workers\.dev" "Workers.dev URLs (except as legacy note)"
echo ""

echo "── Brand name consistency ───────────────────────"
check "SelFi[^-]" "SelFi without hyphen (should be Sel-Fi)"
check "Selfi[^-]" "Selfi without hyphen (should be Sel-Fi)"
check "sel-fi" "Lowercase sel-fi in display text (should be Sel-Fi in UI)"
echo ""

echo "── Legacy localStorage keys ─────────────────────"
check '"hm_' "Old hm_* localStorage keys (should be selfi_*)"
check "'hm_" "Old hm_* localStorage keys (single quotes)"
echo ""

echo "── Post-Mapbox migration ────────────────────────"
check "maplibre" "MapLibre references (should be Mapbox after Batch 14)"
check "leaflet" "Leaflet references (should be removed)"
echo ""

echo "── Content compliance ───────────────────────────"
check "will save" "Absolute claims: 'will save' (should be 'may save')"
check "guaranteed" "Absolute claims: 'guaranteed'"
check "always save" "Absolute claims: 'always save'"
echo ""

echo "═══════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
  echo "  ✅ All checks passed! Brand is consistent."
else
  echo "  ⚠️  $ERRORS issue(s) found. Review and fix above."
fi
echo "═══════════════════════════════════════════════════"
