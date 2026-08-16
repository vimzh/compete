/**
 * YouCam provider — not wired up yet.
 *
 * The hackathon requires at least one YouCam API call, so this is where the
 * Apparel VTO / background-removal request goes. It deliberately mirrors the
 * OpenAI provider's signature (`cutout(buffer) -> data URL`) so switching is a
 * one-line change in providers/index.js with nothing else touched.
 *
 * Open question that blocks this: whether Apparel VTO accepts an arbitrary
 * scraped garment image, or needs a structured garment/category payload.
 * See docs/idea.md.
 */
export async function cutout() {
  throw Object.assign(new Error('YouCam provider is not implemented yet.'), { status: 501 });
}

export const name = 'youcam';
