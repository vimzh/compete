/**
 * A starter closet.
 *
 * Real cutouts, produced by the live ingestion pipeline from actual Myntra
 * product pages and then checked in — so the canvas has something to build
 * with before anyone pastes a link, and a demo never depends on a network
 * round trip landing on cue.
 *
 * `image` is a bundled asset rather than a data URL: the originals were ~2MB
 * of base64 each, which is fine over the wire once but not fine sitting in a
 * JS module. Re-generate by ingesting the `pageUrl` below.
 */
const SEED_ITEMS = [
  {
    id: 'seed-top',
    title: '7TH LEGION Men Comfort Printed Casual Shirt',
    brand: '7TH LEGION',
    price: 'INR 376',
    category: 'top',
    image: require('../../assets/seed/top.png'),
    pageUrl: 'https://www.myntra.com/topwear/7th-legion/7th-legion-men-comfort-printed-casual-shirt/38470008/buy?shared=true',
    seeded: true,
  },
  {
    id: 'seed-bottom',
    title: 'Marks & Spencer Girls Striped Regular Fit High-Rise Cotton Trousers',
    brand: 'Marks & Spencer',
    price: 'INR 1259',
    category: 'bottom',
    image: require('../../assets/seed/bottom.png'),
    pageUrl: 'https://www.myntra.com/trousers/marks+%26+spencer/marks--spencer-girls-striped-regular-fit-high-rise-cotton-trousers/40970263/buy',
    seeded: true,
  },
  {
    id: 'seed-shoes',
    title: 'HRX by Hrithik Roshan Unisex Back To School Shoes',
    brand: 'HRX by Hrithik Roshan',
    price: 'INR 1108',
    category: 'shoes',
    image: require('../../assets/seed/shoes.png'),
    pageUrl: 'https://www.myntra.com/casual-shoes/hrx+by+hrithik+roshan/hrx-by-hrithik-roshan-unisex-back-to-school-shoes/29553912/buy',
    seeded: true,
  },
  {
    id: 'seed-cap',
    title: 'Decathlon Forclaz - Men Green Trucker 500 Airing Hiking Caps',
    brand: 'Decathlon',
    price: 'INR 599',
    category: 'accessory',
    image: require('../../assets/seed/cap.png'),
    pageUrl: 'https://www.myntra.com/caps/decathlon/decathlon-forclaz---men-green-trucker-500-airing-hiking-caps/41089645/buy',
    seeded: true,
  },
  {
    id: 'seed-watch',
    title: 'TISSOT Unisex Stainless Steel Straps Analogue Watch T1372101109100',
    brand: 'TISSOT',
    price: 'INR 44000',
    category: 'accessory',
    image: require('../../assets/seed/watch.png'),
    pageUrl: 'https://www.myntra.com/watches/tissot/tissot-unisex-stainless-steel-straps-analogue-watch-t1372101109100/26662492/buy',
    seeded: true,
  },
];

export default SEED_ITEMS;
