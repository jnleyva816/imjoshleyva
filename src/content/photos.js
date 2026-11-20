/**
 * Photos come from src/assets/photos/working.
 *
 * Every photo in the folder runs in the "Off the clock" carousel. The first
 * ones, in file-name order (prefix 01-, 02-, ... to control it), also fill
 * the spots below. To pin a photo to a spot, list its file name.
 *
 * Spots, in page order. One strong photo per stretch of scrolling:
 *   hero          1 photo, tucked against the portrait
 *   after-work    1 photo, a full-width break after Work
 * Listing two names for after-work gives a staggered pair instead.
 */
export const placements = {
  // hero: ["01-desk.jpg"],
  // "after-work": ["04-team.jpg"],
};

export const captions = {
  // "01-desk.jpg": "First week at Cryptio",
};

/**
 * Alt text for screen readers and the lightbox label. Not shown on the page,
 * so it can be plain description. A caption, if set, is shown and also used.
 */
export const alts = {
  "01-DSCF1128.jpg": "A white spider lily lit by low sun against a dark, leafy backdrop",
  "02-DSCF1340.jpg": "A man in a gray hoodie leans over the open hood of a dark Toyota Supra at a car meet",
  "03-DSCF1447.jpg": "Five people stand talking beside a red Nissan Silvia with gold-flecked paint and black mesh wheels",
  "04-DSCF1377.jpg": "A white and teal BMW Z3 coupe in Marlboro livery parked at a car meet under live oaks",
  "05-DSCF1166.jpg": "Spanish moss draped over a thick oak branch against a blue sky",
  "06-DSCF1491.jpg": "A light blue Lamborghini Huracan parked in front of a concrete garage building",
  "07-DSCF1366.jpg": "The front of a silver BMW 5 Series with a black BMW 7 Series parked behind it",
  "08-DSCF1425.jpg": "A pale green Fiat Topolino microcar seen head-on beneath palm trees",
  "09-DSCF1445.jpg": "Close-up of the cockpit of a red car with a black steering wheel, seen through the open window",
  "10-DSCF1466.jpg": "The nose of a red race-prepped car numbered 306, with other cars lined up behind it",
  "11-DSCF1487.jpg": "A visitor in a white bucket hat and denim coverall walks past a white Honda S2000 with its hood up",
};
