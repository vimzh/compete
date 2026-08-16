import OpenAI, { toFile } from 'openai';

let client;
const openai = () => {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw Object.assign(new Error('OPENAI_API_KEY is not set on the server.'), { status: 500 });
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

/**
 * Deliberately says nothing about an outline.
 *
 * Asking the model for one produced a different result every time — a yellow
 * glow on one garment, a thick white rim on the next — and baked it into the
 * pixels permanently. The outline is drawn in the app instead
 * (components/CutoutImage), where it is one consistent grey and can be changed
 * without re-ingesting anything.
 */
const CUTOUT_PROMPT = [
  'Isolate only the single clothing item worn or shown as the main subject.',
  'Remove the background, any model, mannequin, hanger, props and shadows completely.',
  'Output the garment on a fully transparent background, cropped to the garment.',
  'Keep the original colour, print, fabric texture and proportions exactly as they are.',
  'Do not stylise, redraw or smooth the pattern. Do not add an outline, glow, shadow,',
  'text, watermark or any new element.',
].join(' ');

/**
 * Cuts the garment out of a product photo.
 * Returns a transparent PNG as a data URL.
 */
export async function cutout(imageBuffer) {
  const file = await toFile(imageBuffer, 'product.png', { type: 'image/png' });

  const result = await openai().images.edit({
    model: 'gpt-image-1',
    image: file,
    prompt: CUTOUT_PROMPT,
    size: '1024x1024',
    background: 'transparent',
    output_format: 'png',
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) {
    throw Object.assign(new Error('The cutout step returned no image.'), { status: 502 });
  }
  return `data:image/png;base64,${b64}`;
}

/**
 * Fallback metadata reader for pages with no structured data. Only called when
 * the deterministic extractors come back empty.
 */
export async function describeProduct({ title, pageUrl }) {
  const response = await openai().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You label fashion products. Reply with compact JSON only: ' +
          '{"title":string,"brand":string|null,"category":string}. ' +
          'category is one of: top, bottom, dress, outerwear, shoes, accessory.',
      },
      { role: 'user', content: `Page title: ${title || 'unknown'}\nURL: ${pageUrl}` },
    ],
    response_format: { type: 'json_object' },
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
    return { title: title || 'Saved piece', brand: null, category: 'top' };
  }
}

export const name = 'openai';
