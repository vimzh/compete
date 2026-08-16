/**
 * A closet item's image source.
 *
 * Ingested pieces carry a data URL string; the seeded ones carry a bundled
 * asset from `require()`, which React Native resolves to a module reference
 * rather than a string. Both have to render through the same components, so
 * the branch lives here instead of at every call site.
 */
export default function itemImage(item) {
  const image = item?.image;
  return typeof image === 'string' ? { uri: image } : image;
}
