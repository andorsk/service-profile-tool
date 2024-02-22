// CLI Tool

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Use yargs in a chainable API way and access argv at the end
const argv = yargs(hideBin(process.argv))
  .option("ships", {
    describe: "number of ships",
    type: "number",
  })
  .option("distance", {
    describe: "distance to travel",
    type: "number",
  })
  .parse();

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log("Plunder more riffiwobbles!");
} else {
  console.log("Retreat from the xupptumblers!");
}
