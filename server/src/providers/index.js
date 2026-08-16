import * as openai from './openai.js';
import * as youcam from './youcam.js';

const PROVIDERS = { openai, youcam };

/**
 * Swap the cutout backend with CUTOUT_PROVIDER=youcam once that path works.
 * Metadata fallback always uses OpenAI — YouCam has no equivalent.
 */
export const cutoutProvider = PROVIDERS[process.env.CUTOUT_PROVIDER || 'openai'] || openai;
export const describeProduct = openai.describeProduct;
