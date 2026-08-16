import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { extractProduct } from './extract.js';
import { BROWSER_HEADERS, unblockerReady } from './fetchPage.js';
import { googleConfigured } from './google.js';
import { normalizeInput } from './links.js';
import { supportedSites } from './sites.js';
import { cutoutProvider, describeProduct } from './providers/index.js';
import { authRoutes, meRoutes, userRoutes } from './routes/auth.js';
import { loadStore } from './store.js';

const app = new Hono();

// The app runs on a device/emulator on the LAN, so it is never same-origin.
app.use('/*', cors());

app.get('/health', (c) =>
  c.json({
    ok: true,
    provider: cutoutProvider.name,
    hasKey: Boolean(process.env.OPENAI_API_KEY),
    googleAuth: googleConfigured ? 'configured' : 'dev',
    unblocker: unblockerReady() ? 'brightdata' : 'none',
    sites: supportedSites().length,
  }),
);

app.route('/api/auth', authRoutes);
app.route('/api/me', meRoutes);
app.route('/api/users', userRoutes);

/** Lets the client show "works with…" without hardcoding the list twice. */
app.get('/api/sites', (c) => c.json({ sites: supportedSites() }));

/**
 * Product image CDNs reject hotlinks with no referer far more often than they
 * reject an odd user-agent, so mirror the page we found the image on.
 */
async function downloadImage(imageUrl, pageUrl) {
  return fetch(imageUrl, {
    headers: { ...BROWSER_HEADERS, accept: 'image/avif,image/webp,image/*,*/*', referer: pageUrl },
    redirect: 'follow',
  });
}

/**
 * POST /api/ingest  { url }
 *
 * Share text -> product image + metadata -> transparent cutout.
 * Returns everything the client needs to render a closet item.
 */
app.post('/api/ingest', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Send a JSON body with a url.' }, 400);
  }

  try {
    // Accepts a raw paste: share text, a shortener, or an app deep link.
    const url = normalizeInput(body?.url ?? body?.text);
    const product = await extractProduct(url);

    // Only pay for an LLM call when the page gave us nothing useful.
    let { title, brand } = product;
    let category = null;
    if (!title) {
      const described = await describeProduct(product);
      title = described.title;
      brand = brand || described.brand;
      category = described.category;
    }

    // The upgraded (full-size) URL is a rewrite, so fall back to the original
    // if the CDN does not recognise it.
    let imageResponse = await downloadImage(product.imageUrl, product.pageUrl);
    let sourceImage = product.imageUrl;
    if (!imageResponse.ok && product.rawImageUrl && product.rawImageUrl !== product.imageUrl) {
      imageResponse = await downloadImage(product.rawImageUrl, product.pageUrl);
      sourceImage = product.rawImageUrl;
    }
    if (!imageResponse.ok) {
      return c.json({ error: 'Could not download the product image.' }, 422);
    }

    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const image = await cutoutProvider.cutout(buffer);

    return c.json({
      id: `item-${Date.now()}`,
      title: title || 'Saved piece',
      brand: brand || null,
      price: product.price || null,
      category,
      image,
      originalImage: sourceImage,
      pageUrl: product.pageUrl,
      extractedVia: product.source,
      fetchedVia: product.fetchedVia,
    });
  } catch (error) {
    const status = error.status || 500;
    if (status >= 500) console.error('[ingest]', error);
    return c.json({ error: error.message || 'Ingestion failed.' }, status);
  }
});

const port = Number(process.env.PORT || 8787);

// Accounts are read from disk before the first request, so a restart never
// serves an empty user table and signs everyone out.
await loadStore();

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, () => {
  console.log(`fitterest server on http://0.0.0.0:${port} (provider: ${cutoutProvider.name})`);
  if (!googleConfigured) {
    console.warn('[auth] no GOOGLE_CLIENT_ID — accepting dev sign-ins only');
  }
});
