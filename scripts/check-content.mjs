// Runs first in `npm run build`: stops on a malformed content file with a
// readable list of what's wrong. The rules are in scripts/content-schema.mjs.
import { problems } from "./content-schema.mjs";

const found = await problems();
if (found.length) {
  console.error(`Content check failed:\n${found.map((line) => `  - ${line}`).join("\n")}`);
  process.exit(1);
}
console.log("content check passed");
