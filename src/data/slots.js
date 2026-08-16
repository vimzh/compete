/**
 * The checklist shown when starting a board. `key` doubles as the category we
 * match ingested pieces against, so keep these aligned with the categories the
 * server returns (see server/src/providers/openai.js).
 *
 * Order here is the order slots appear on the canvas — roughly head to foot,
 * accessories last.
 */
const SLOTS = [
  { key: 'cap', label: 'Cap', category: 'accessory' },
  { key: 'outerwear', label: 'Outerwear', category: 'outerwear' },
  { key: 'top', label: 'T-shirt', category: 'top' },
  { key: 'dress', label: 'Dress', category: 'dress' },
  { key: 'bottom', label: 'Bottom', category: 'bottom' },
  { key: 'shoes', label: 'Shoes', category: 'shoes' },
  { key: 'bag', label: 'Bag', category: 'accessory' },
  { key: 'headphones', label: 'Headphones', category: 'accessory' },
  { key: 'watch', label: 'Watch', category: 'accessory' },
];

/** Sensible starting selection so the sheet is never a blank checklist. */
export const DEFAULT_SLOTS = ['top', 'bottom', 'shoes'];


/**
 * Flat-lay regions, in percentages of the board.
 *
 * A uniform grid reads like a spreadsheet; a real outfit board sizes pieces by
 * how much they matter — top and bottom dominate the left column, accessories
 * stack down the right. Positions are fixed per garment type so any selection
 * of slots still lands in a sensible arrangement, and gaps read as deliberate
 * negative space rather than missing tiles.
 */
export const REGIONS = {
  top: { left: 2, top: 1, width: 54, height: 40 },
  outerwear: { left: 2, top: 1, width: 54, height: 40 },
  dress: { left: 2, top: 1, width: 54, height: 78 },
  bottom: { left: 4, top: 42, width: 50, height: 56 },
  cap: { left: 58, top: 1, width: 40, height: 26 },
  watch: { left: 57, top: 29, width: 19, height: 20 },
  headphones: { left: 57, top: 29, width: 19, height: 20 },
  bag: { left: 78, top: 29, width: 20, height: 20 },
  shoes: { left: 57, top: 52, width: 41, height: 30 },
};

export const regionFor = (key) => REGIONS[key] || { left: 60, top: 80, width: 36, height: 18 };

export const slotByKey = (key) => SLOTS.find((slot) => slot.key === key);

export default SLOTS;
