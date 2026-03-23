// public/_worker.js
// Mega-Batch B — Cloudflare Worker for:
// 1. Canonical domain redirects (sel-fi.com → sel-fi.ca, workers.dev → sel-fi.ca)
// 2. Bot user-agent prerendering (serves pre-rendered HTML to Googlebot etc.)
//
// Deploy: this file goes in /public/ and Cloudflare Pages auto-deploys it as a Worker.
//
// PRERENDERING OPTIONS:
// Option A (recommended): Use Prerender.io service — set PRERENDER_TOKEN in Worker env vars.
// Option B: Use Google's Rendertron (self-hosted or public instance).
// Option C: Return the SPA HTML and rely on Google's JS rendering (current fallback).
//
// For Option A, sign up at prerender.io (free tier: 250 pages/month).

const CANONICAL_DOMAIN = "sel-fi.ca";
const CANONICAL_ORIGIN = "https://sel-fi.ca";

// Bot user-agents that benefit from prerendered HTML
const BOT_USER_AGENTS = [
  "googlebot", "bingbot", "yandex", "baiduspider", "facebookexternalhit",
  "twitterbot", "rogerbot", "linkedinbot", "embedly", "quora link preview",
  "showyoubot", "outbrain", "pinterest", "slackbot", "vkshare", "w3c_validator",
  "whatsapp", "applebot", "duckduckbot",
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    const userAgent = request.headers.get("user-agent") || "";

    // ── 1. Canonical domain redirect ──
    // Redirect sel-fi.com → sel-fi.ca (301)
    // Redirect workers.dev → sel-fi.ca (301)
    // Preserve path and query string
    if (
      hostname !== CANONICAL_DOMAIN &&
      hostname !== `business.${CANONICAL_DOMAIN}` &&
      hostname !== "localhost" &&
      !hostname.includes("127.0.0.1")
    ) {
      // Check if it's a known domain that should redirect
      if (
        hostname === "sel-fi.com" ||
        hostname === "www.sel-fi.com" ||
        hostname === "www.sel-fi.ca" ||
        hostname.endsWith(".workers.dev")
      ) {
        const redirectUrl = `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;
        return new Response(null, {
          status: 301,
          headers: { Location: redirectUrl },
        });
      }
    }

    // ── 2. Bot prerendering ──
    if (isBot(userAgent) && env.PRERENDER_TOKEN) {
      // Use Prerender.io to serve pre-rendered HTML to bots
      const prerenderUrl = `https://service.prerender.io/${url.toString()}`;
      try {
        const prerenderResponse = await fetch(prerenderUrl, {
          headers: { "X-Prerender-Token": env.PRERENDER_TOKEN },
          cf: { cacheTtl: 86400, cacheEverything: true }, // Cache for 24h
        });
        if (prerenderResponse.ok) {
          // Return prerendered HTML with correct headers
          const html = await prerenderResponse.text();
          return new Response(html, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=86400",
              "X-Prerendered": "true",
            },
          });
        }
      } catch {
        // Fall through to normal SPA serving
      }
    }

    // ── 3. Normal SPA serving ──
    // Let Cloudflare Pages handle the request normally
    return env.ASSETS.fetch(request);
  },
};
