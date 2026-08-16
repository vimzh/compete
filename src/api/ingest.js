import { API_URL, request } from './config';

export { API_URL };

/** Sends a product link to the ingestion engine and returns a closet item. */
export async function ingestLink(url, { signal, token } = {}) {
  return request('/api/ingest', { method: 'POST', body: { url }, signal, token });
}
