/**
 * Placeholder feed data.
 *
 * Images come from loremflickr tagged fashion/outfit, with a `lock` so each
 * card keeps the same photo between reloads. They stand in for try-on renders
 * — swap this module once the VTO pipeline produces real output.
 *
 * `ratio` is width/height; varied on purpose so the masonry columns stagger.
 */
const LOOKS = [
  { id: '1', title: 'Linen set, take 2', likes: 142, ratio: 0.72, lock: 11 },
  { id: '2', title: 'Charcoal layers', likes: 87, ratio: 1.0, lock: 22 },
  { id: '3', title: 'Oversized denim', likes: 231, ratio: 0.66, lock: 33 },
  { id: '4', title: 'Soft tailoring', likes: 64, ratio: 0.8, lock: 44 },
  { id: '5', title: 'Monochrome knit', likes: 178, ratio: 1.2, lock: 55 },
  { id: '6', title: 'Cropped trench', likes: 55, ratio: 0.7, lock: 66 },
  { id: '7', title: 'Wide leg, low key', likes: 309, ratio: 0.75, lock: 77 },
  { id: '8', title: 'Everyday black', likes: 41, ratio: 0.95, lock: 88 },
];

/** Stand-in for "what this user has bookmarked" until there is a backend. */
export const SAVED_IDS = ['2', '5', '7', '4'];

export const savedLooks = () => LOOKS.filter((look) => SAVED_IDS.includes(look.id));

export const imageUrl = ({ lock, ratio }, width = 400) => {
  const height = Math.round(width / ratio);
  return `https://loremflickr.com/${width}/${height}/fashion,outfit?lock=${lock}`;
};

export default LOOKS;
