import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Arguments } from "./models.js";
import {
  handleCreateProfile,
  handleResolveDID,
  handleValidateProfile,
} from "./handlers.js";

const checkArgs = (args: Arguments): boolean => {
  const total =
    (args.validate ? 1 : 0) +
    (args.resolve != "" ? 1 : 0) +
    (args.create ? 1 : 0);
  return total === 1;
};

const parseArgs = async () => {
  const argv: Arguments | Promise<Arguments> = yargs(hideBin(process.argv))
    .option("validate", {
      describe: "validate the profile",
      type: "boolean",
      default: false,
    })
    .option("url", {
      describe: "url of the profile",
      type: "string",
    })
    .option("resolve", {
      describe: "resove the did",
      type: "string",
      default: "",
    })
    .option("create", {
      describe: "create a service profile",
      type: "boolean",
      default: false,
    })
    .parse();
  return await argv; // Await if argv is a promise
};

const main = async () => {
  const args = await parseArgs();
  const valid = checkArgs(args);
  if (!valid) {
    console.error("Invalid arguments");
    process.exit(1);
  }
  if (args.validate) {
    await handleValidateProfile(args);
    process.exit(0);
  } else if (args.resolve) {
    handleResolveDID(args);
    process.exit(0);
  } else if (args.create) {
    console.log("Creating a service profile");
    await handleCreateProfile();
    process.exit(0);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
